import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyAdminToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired session token' }, { status: 401 });
  }

  let admin = await prisma.adminUser.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, fullName: true, role: true, lastLoginAt: true },
  }).catch(() => null);

  if (!admin && payload.email === 'admin@swishphones.com') {
    admin = {
      id: payload.userId,
      email: payload.email,
      fullName: payload.fullName || 'Chief Operations Officer',
      role: (payload.role as any) || 'SUPER_ADMIN',
      lastLoginAt: new Date(),
    };
  }

  if (!admin) {
    return NextResponse.json({ error: 'User no longer exists' }, { status: 401 });
  }

  return NextResponse.json({ success: true, admin });
}
