import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber')?.trim();
    const email = searchParams.get('email')?.toLowerCase().trim();

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order Number is required' }, { status: 400 });
    }

    const where: any = { orderNumber };
    if (email) {
      where.customerEmail = email;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            inventoryItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'No order found with provided details. Check your Order Number.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json({ error: 'Failed to retrieve order' }, { status: 500 });
  }
}
