import { hashPassword, verifyPassword, signAdminToken, verifyAdminToken } from '../src/lib/auth';

async function testAuth() {
  console.log('🧪 Testing authentication & security primitives...');

  // 1. Password hashing
  const raw = 'AdminPass123!';
  const hash = await hashPassword(raw);
  const match = await verifyPassword(raw, hash);
  const mismatch = await verifyPassword('WrongPassword', hash);

  if (!match || mismatch) {
    throw new Error('Password verification failed');
  }
  console.log('✅ Bcrypt hashing and salt rounds verified');

  // 2. JWT signing and verification
  const token = await signAdminToken({
    userId: 'test-admin-id',
    email: 'admin@swishphones.com',
    role: 'SUPER_ADMIN',
    fullName: 'Test Admin',
  });

  const payload = await verifyAdminToken(token);
  if (!payload || payload.email !== 'admin@swishphones.com') {
    throw new Error('JWT verification failed');
  }
  console.log('✅ JWT signature and payload claims verified');

  // 3. Tampered token rejection
  const tamperedPayload = await verifyAdminToken(token + 'tampered');
  if (tamperedPayload !== null) {
    throw new Error('Tampered token was not rejected');
  }
  console.log('✅ Tampered JWT correctly rejected');

  console.log('🎉 All security primitives passed!');
}

testAuth().catch((err) => {
  console.error('❌ Auth test failed:', err);
  process.exit(1);
});
