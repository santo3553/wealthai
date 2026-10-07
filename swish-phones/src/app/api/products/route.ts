import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureDatabaseSeeded } from '@/lib/ensureSeed';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await ensureDatabaseSeeded();

    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const condition = searchParams.get('condition');
    const storage = searchParams.get('storage');

    const where: any = {};
    if (brand && brand !== 'all') {
      where.brand = { equals: brand };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        inventoryItems: {
          where: {
            stockStatus: 'AVAILABLE',
            ...(condition && condition !== 'all' ? { conditionGrade: condition } : {}),
            ...(storage && storage !== 'all' ? { storage } : {}),
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 });
  }
}
