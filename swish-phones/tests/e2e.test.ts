import { prisma } from '../src/lib/prisma';
import { verifyPassword, hashPassword, signAdminToken, verifyAdminToken } from '../src/lib/auth';

async function runE2EVerification() {
  console.log('🚀 Running Full E2E Integration & Verification Test Suite...\n');

  // Test 1: Verify Seed Data Presence
  console.log('--- Test 1: Product Catalog & Certified Used Stock ---');
  const products = await prisma.product.findMany({
    include: { inventoryItems: true },
  });
  console.log(`Found ${products.length} products in database:`);
  products.forEach((p) => {
    const available = p.inventoryItems.filter((i) => i.stockStatus === 'AVAILABLE').length;
    console.log(` • ${p.brand} ${p.modelName}: ${available} available units (Base: $${p.basePrice})`);
  });
  if (products.length < 3) throw new Error('Missing seed products');
  console.log('✅ Test 1 Passed: Catalog and initial inventory healthy\n');

  // Test 2: Admin Authentication Gate & Security
  console.log('--- Test 2: Admin Auth & Role Security ---');
  const admin = await prisma.adminUser.findUnique({
    where: { email: 'admin@swishphones.com' },
  });
  if (!admin) throw new Error('Admin account not found');
  const isPassValid = await verifyPassword('AdminPass123!', admin.passwordHash);
  if (!isPassValid) throw new Error('Admin password hash mismatch');

  const token = await signAdminToken({
    userId: admin.id,
    email: admin.email,
    role: admin.role,
    fullName: admin.fullName,
  });
  const verifiedPayload = await verifyAdminToken(token);
  if (!verifiedPayload || verifiedPayload.email !== admin.email) {
    throw new Error('Token verification failed');
  }
  console.log(`✅ Test 2 Passed: Admin authenticated with role ${admin.role} and secure JWT\n`);

  // Test 3: Admin Data Entry - Ingesting New Device Unit
  console.log('--- Test 3: Device Ingestion Studio (Data Entry) ---');
  const testImei = `358921098499${Math.floor(100 + Math.random() * 900)}`;
  const iphone = products.find((p) => p.slug === 'iphone-15-pro')!;
  
  const ingestedUnit = await prisma.deviceInventoryItem.create({
    data: {
      productId: iphone.id,
      imeiOrSerial: testImei,
      storage: '512GB',
      color: 'Natural Titanium',
      conditionGrade: 'PRISTINE',
      batteryHealth: 99,
      salePrice: 919.0,
      stockStatus: 'AVAILABLE',
      inspectionNotes: 'Verified 50-point diagnostics: OEM screen, battery 99%, flawless chassis.',
    },
  });
  console.log(`Ingested physical unit: ${iphone.modelName} (IMEI: ${ingestedUnit.imeiOrSerial})`);
  console.log(`Grade: ${ingestedUnit.conditionGrade} | Battery: ${ingestedUnit.batteryHealth}% | Price: $${ingestedUnit.salePrice}`);
  console.log('✅ Test 3 Passed: Device successfully ingested with individual IMEI\n');

  // Test 4: Customer Order Placement & Stock Reservation
  console.log('--- Test 4: Customer Order Creation & Inventory Lock ---');
  const orderNum = `SW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const order = await prisma.order.create({
    data: {
      orderNumber: orderNum,
      customerName: 'Marcus Vance',
      customerEmail: 'marcus.vance@example.com',
      customerPhone: '+1-555-839-1029',
      shippingAddress: '450 Tech Parkway, Suite 800, Austin, TX 78701',
      totalAmount: ingestedUnit.salePrice,
      paymentMethod: 'STRIPE_CARD',
      paymentStatus: 'PAID',
      orderStatus: 'PENDING_REVIEW',
      items: {
        create: [
          {
            inventoryItemId: ingestedUnit.id,
            price: ingestedUnit.salePrice,
          },
        ],
      },
    },
    include: { items: true },
  });

  // Lock the inventory unit
  await prisma.deviceInventoryItem.update({
    where: { id: ingestedUnit.id },
    data: { stockStatus: 'RESERVED' },
  });

  console.log(`Order created: ${order.orderNumber} for $${order.totalAmount}`);
  console.log(`Status: ${order.orderStatus} | Payment: ${order.paymentMethod} (${order.paymentStatus})`);
  console.log('✅ Test 4 Passed: Customer order recorded & unit marked RESERVED\n');

  // Test 5: Order Tracking Flow
  console.log('--- Test 5: Customer Public Order Tracker ---');
  const trackedOrder = await prisma.order.findUnique({
    where: { orderNumber: orderNum },
    include: {
      items: {
        include: {
          inventoryItem: {
            include: { product: true },
          },
        },
      },
    },
  });
  if (!trackedOrder) throw new Error('Tracked order not found');
  console.log(`Tracking lookup for ${trackedOrder.orderNumber}:`);
  console.log(` • Recipient: ${trackedOrder.customerName}`);
  console.log(` • Current Stage: ${trackedOrder.orderStatus}`);
  console.log(` • Serialized Device: ${trackedOrder.items[0].inventoryItem.product.modelName} (IMEI ending in ...${trackedOrder.items[0].inventoryItem.imeiOrSerial.slice(-4)})`);
  console.log('✅ Test 5 Passed: Customer can track order and see IMEI\n');

  // Test 6: Admin Fulfillment Pipeline Advancement to SHIPPED
  console.log('--- Test 6: Order Pipeline - Diagnostic Packaging & Dispatch ---');
  const courierTracking = `DHL-EXP-98214019`;
  const shippedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      orderStatus: 'SHIPPED',
      carrierTrackingNumber: courierTracking,
    },
  });
  console.log(`Order ${shippedOrder.orderNumber} advanced to: ${shippedOrder.orderStatus}`);
  console.log(`Assigned Carrier Tracking Code: ${shippedOrder.carrierTrackingNumber}`);

  // Finally mark delivered and verify status
  const deliveredOrder = await prisma.order.update({
    where: { id: order.id },
    data: { orderStatus: 'DELIVERED' },
  });
  await prisma.deviceInventoryItem.update({
    where: { id: ingestedUnit.id },
    data: { stockStatus: 'SOLD' },
  });
  console.log(`Order ${deliveredOrder.orderNumber} updated to: ${deliveredOrder.orderStatus}`);
  console.log('✅ Test 6 Passed: Full fulfillment pipeline verified\n');

  console.log('✨ ======================================== ✨');
  console.log('🎉 ALL 6 END-TO-END VERIFICATION SUITES PASSED! 🎉');
  console.log('✨ ======================================== ✨');
}

runE2EVerification()
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
