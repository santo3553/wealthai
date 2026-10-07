import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { z } from 'zod';

// In-memory rate limiter for brute-force protection
const rateLimitMap = new Map<string, { attempts: number; resetTime: number }>();

const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    // 1. Client IP tracking for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'local-ip';
    const now = Date.now();
    const rateLimit = rateLimitMap.get(ip);

    if (rateLimit && now < rateLimit.resetTime) {
      if (rateLimit.attempts >= 5) {
        const remainingMinutes = Math.ceil((rateLimit.resetTime - now) / 60000);
        return NextResponse.json(
          {
            error: `Too many failed login attempts. Account temporarily locked. Please try again in ${remainingMinutes} minute(s).`,
          },
          { status: 429 }
        );
      }
    } else if (rateLimit && now >= rateLimit.resetTime) {
      rateLimitMap.delete(ip);
    }

    // 2. Validate request payload
    const body = await request.json();
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    // 3. Find Admin in DB
    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Invalid email or password credentials' },
        { status: 401 }
      );
    }

    // Check if account is locked in database
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      return NextResponse.json(
        { error: 'Account is locked due to security policy. Please contact administrator.' },
        { status: 403 }
      );
    }

    // 4. Verify password with bcrypt
    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      recordFailedAttempt(ip);

      // Increment DB failed attempts
      const failedCount = admin.failedLoginAttempts + 1;
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          failedLoginAttempts: failedCount,
          lockedUntil: failedCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      });

      return NextResponse.json(
        { error: 'Invalid email or password credentials' },
        { status: 401 }
      );
    }

    // Reset rate limiter and failed attempts on success
    rateLimitMap.delete(ip);
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // 5. Sign JWT session token
    const token = await signAdminToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
      fullName: admin.fullName,
    });

    // 6. Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing authentication' },
      { status: 500 }
    );
  }
}

function recordFailedAttempt(ip: string) {
  const current = rateLimitMap.get(ip);
  if (current) {
    current.attempts += 1;
  } else {
    rateLimitMap.set(ip, { attempts: 1, resetTime: Date.now() + 15 * 60 * 1000 });
  }
}
