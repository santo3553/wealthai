import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing records if any
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.deviceInventoryItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.adminUser.deleteMany();

  // 1. Seed Admin User
  const passwordHash = await bcrypt.hash('AdminPass123!', 12);
  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@swishphones.com',
      passwordHash,
      fullName: 'Chief Operations Officer',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Seed Products
  const iphone15Pro = await prisma.product.create({
    data: {
      brand: 'Apple',
      modelName: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      basePrice: 799.0,
      description:
        'Certified refurbished iPhone 15 Pro forged in titanium. Powered by the breakthrough A17 Pro chip with hardware-accelerated ray tracing and Pro camera system.',
      specsJson: JSON.stringify({
        display: '6.1-inch Super Retina XDR OLED, ProMotion 120Hz, 2000 nits peak',
        chipset: 'Apple A17 Pro (3nm), 6-core CPU, 6-core GPU',
        camera: '48MP Main (f/1.78) + 12MP Ultra Wide + 12MP 3x Telephoto',
        battery: 'Up to 23 hours video playback, MagSafe 15W',
        chassis: 'Grade 5 Aerospace Titanium with Ceramic Shield front',
        connectivity: '5G Sub-6/mmWave, Wi-Fi 6E, USB-C 3.0 (10Gbps)',
      }),
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
      ]),
      isFeatured: true,
    },
  });

  const s24Ultra = await prisma.product.create({
    data: {
      brand: 'Samsung',
      modelName: 'Galaxy S24 Ultra',
      slug: 'galaxy-s24-ultra',
      basePrice: 849.0,
      description:
        'Certified pre-owned Galaxy S24 Ultra with Galaxy AI suite, anti-reflective Corning Gorilla Armor, and 200MP camera system.',
      specsJson: JSON.stringify({
        display: '6.8-inch Dynamic AMOLED 2X, QHD+, 1-120Hz, 2600 nits',
        chipset: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
        camera: '200MP Wide + 50MP 5x Periscope + 10MP 3x Telephoto + 12MP Ultra Wide',
        battery: '5000 mAh, 45W wired, 15W wireless, Wireless PowerShare',
        chassis: 'Titanium Shield with integrated S-Pen stylus',
        connectivity: '5G Dual SIM, Wi-Fi 7, Bluetooth 5.3',
      }),
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
      ]),
      isFeatured: true,
    },
  });

  const pixel8Pro = await prisma.product.create({
    data: {
      brand: 'Google',
      modelName: 'Pixel 8 Pro',
      slug: 'pixel-8-pro',
      basePrice: 629.0,
      description:
        'Certified pre-owned Google Pixel 8 Pro with custom Google Tensor G3, thermometer sensor, and Best Take computational photography.',
      specsJson: JSON.stringify({
        display: '6.7-inch Super Actua LTPO OLED, 1-120Hz, 2400 nits peak',
        chipset: 'Google Tensor G3, Titan M2 security coprocessor',
        camera: '50MP Octa PD Main + 48MP Quad PD Ultra Wide + 48MP 5x Telephoto',
        battery: '5050 mAh, 30W fast charge, Extreme Battery Saver up to 72 hours',
        chassis: 'Polished aluminum frame with matte soft-touch back glass',
        connectivity: '5G, Wi-Fi 7, Ultra-Wideband (UWB)',
      }),
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
      ]),
      isFeatured: true,
    },
  });

  console.log('✅ Products seeded: iPhone 15 Pro, Galaxy S24 Ultra, Pixel 8 Pro');

  // 3. Seed Individual Used Inventory Units
  const inventoryData = [
    // iPhone 15 Pro Units
    {
      productId: iphone15Pro.id,
      imeiOrSerial: '358921098471923',
      storage: '256GB',
      color: 'Natural Titanium',
      conditionGrade: 'PRISTINE',
      batteryHealth: 98,
      salePrice: 879.0,
      stockStatus: 'AVAILABLE',
      inspectionNotes: 'Zero cosmetic marks. Screen & battery 100% original OEM. 50-point diagnostic certified.',
    },
    {
      productId: iphone15Pro.id,
      imeiOrSerial: '358921098471924',
      storage: '128GB',
      color: 'Space Black',
      conditionGrade: 'GOOD',
      batteryHealth: 94,
      salePrice: 799.0,
      inspectionNotes: 'Faint micro-scratch on bottom charging bevel. Display completely flawless. Fully tested.',
    },
    {
      productId: iphone15Pro.id,
      imeiOrSerial: '358921098471925',
      storage: '512GB',
      color: 'White Titanium',
      conditionGrade: 'FAIR',
      batteryHealth: 90,
      salePrice: 829.0,
      inspectionNotes: 'Light edge scuffs near SIM tray. Camera glass & OLED immaculate. Great value tier.',
    },
    // Galaxy S24 Ultra Units
    {
      productId: s24Ultra.id,
      imeiOrSerial: '352981048175019',
      storage: '256GB',
      color: 'Titanium Gray',
      conditionGrade: 'PRISTINE',
      batteryHealth: 99,
      salePrice: 899.0,
      inspectionNotes: 'Mint condition showcase unit. S-Pen included, battery tested 99% health. Certified.',
    },
    {
      productId: s24Ultra.id,
      imeiOrSerial: '352981048175020',
      storage: '512GB',
      color: 'Titanium Black',
      conditionGrade: 'GOOD',
      batteryHealth: 95,
      salePrice: 949.0,
      inspectionNotes: 'Minor hairline mark on side rail. Screen pristine anti-reflective coating intact.',
    },
    // Pixel 8 Pro Units
    {
      productId: pixel8Pro.id,
      imeiOrSerial: '354819284710293',
      storage: '128GB',
      color: 'Bay Blue',
      conditionGrade: 'PRISTINE',
      batteryHealth: 97,
      salePrice: 659.0,
      inspectionNotes: 'Like-new condition. Camera visor without scratches. 12-month refurbishment warranty.',
    },
    {
      productId: pixel8Pro.id,
      imeiOrSerial: '354819284710294',
      storage: '256GB',
      color: 'Obsidian',
      conditionGrade: 'GOOD',
      batteryHealth: 92,
      salePrice: 629.0,
      inspectionNotes: 'Light wear around USB-C port. Passed all hardware and sensor diagnostics.',
    },
  ];

  for (const item of inventoryData) {
    await prisma.deviceInventoryItem.create({ data: item });
  }

  console.log(`✅ Seeded ${inventoryData.length} certified used inventory units`);
  console.log('🎉 Database seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
