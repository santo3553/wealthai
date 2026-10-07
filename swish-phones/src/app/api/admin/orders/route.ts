import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateOrderSchema = z.object({
  id: z.string().min(1, 'Order ID is required'),
  orderStatus: z.enum([
    'PENDING_REVIEW',
    'DIAGNOSTIC_PACKAGING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]),
  carrierTrackingNumber: z.string().optional(),
});

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            inventoryItem: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parse = updateOrderSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, orderStatus, carrierTrackingNumber } = parse.data;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        orderStatus,
        ...(carrierTrackingNumber ? { carrierTrackingNumber } : {}),
      },
    });

    // If order delivered, mark items as SOLD in inventory
    if (orderStatus === 'DELIVERED') {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (order) {
        for (const item of order.items) {
          await prisma.deviceInventoryItem.update({
            where: { id: item.inventoryItemId },
            data: { stockStatus: 'SOLD' },
          });
        }
      }
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
