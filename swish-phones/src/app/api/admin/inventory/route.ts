import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureDatabaseSeeded } from '@/lib/ensureSeed';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createItemSchema = z.object({
  productId: z.string().min(1, 'Product selection is required'),
  imeiOrSerial: z.string().min(8, 'Valid IMEI/Serial is required'),
  storage: z.string().min(2, 'Storage capacity is required'),
  color: z.string().min(2, 'Colorway is required'),
  conditionGrade: z.enum(['PRISTINE', 'GOOD', 'FAIR']),
  batteryHealth: z.number().min(50).max(100),
  salePrice: z.number().positive('Sale price must be greater than zero'),
  inspectionNotes: z.string().optional(),
  images: z.array(z.string()).optional(),
  imagesJson: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const items = await prisma.deviceInventoryItem.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    const products = await prisma.product.findMany({
      select: { id: true, modelName: true, brand: true, basePrice: true },
    });

    return NextResponse.json({ success: true, items, products });
  } catch (error) {
    console.error('Fetch inventory error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parse = createItemSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parse.data;

    // Check duplicate IMEI
    const existing = await prisma.deviceInventoryItem.findUnique({
      where: { imeiOrSerial: data.imeiOrSerial.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Device with IMEI ${data.imeiOrSerial} is already cataloged.` },
        { status: 400 }
      );
    }

    const newItem = await prisma.deviceInventoryItem.create({
      data: {
        productId: data.productId,
        imeiOrSerial: data.imeiOrSerial.trim(),
        storage: data.storage,
        color: data.color,
        conditionGrade: data.conditionGrade,
        batteryHealth: data.batteryHealth,
        salePrice: data.salePrice,
        inspectionNotes: data.inspectionNotes || 'Standard 50-point diagnostic certified.',
        imagesJson: data.images ? JSON.stringify(data.images) : (data.imagesJson || '[]'),
        stockStatus: 'AVAILABLE',
      },
      include: { product: true },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Create inventory item error:', error);
    return NextResponse.json({ error: 'Failed to ingest device' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, stockStatus, salePrice, images, imagesJson } = body;

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const updated = await prisma.deviceInventoryItem.update({
      where: { id },
      data: {
        ...(stockStatus ? { stockStatus } : {}),
        ...(salePrice ? { salePrice: parseFloat(salePrice) } : {}),
        ...(images ? { imagesJson: JSON.stringify(images) } : imagesJson ? { imagesJson } : {}),
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Update inventory item error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await prisma.deviceInventoryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
