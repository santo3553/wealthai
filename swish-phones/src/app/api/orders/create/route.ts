import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(6, 'Valid phone number is required'),
  shippingAddress: z.string().min(10, 'Complete shipping address is required'),
  paymentMethod: z.enum(['STRIPE_CARD', 'CASH_ON_DELIVERY', 'BANK_TRANSFER']),
  items: z.array(
    z.object({
      id: z.string(),
      productId: z.string(),
      price: z.number().positive(),
      imei: z.string().optional(),
    })
  ).min(1, 'At least one item is required in cart'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parse = createOrderSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.errors[0].message },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, items } =
      parse.data;

    const totalAmount = items.reduce((sum, i) => sum + i.price, 0);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SW-2026-${randomSuffix}`;

    // Create Order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone,
        shippingAddress,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'STRIPE_CARD' ? 'PAID' : 'PENDING',
        orderStatus: 'PENDING_REVIEW',
      },
    });

    // Create Order Items and update inventory status if matching unit found
    for (const item of items) {
      let invItem = await prisma.deviceInventoryItem.findFirst({
        where: { id: item.id },
      });

      if (!invItem) {
        invItem = await prisma.deviceInventoryItem.findFirst({
          where: { productId: item.productId, stockStatus: 'AVAILABLE' },
        });
      }

      if (invItem) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            inventoryItemId: invItem.id,
            price: item.price,
          },
        });

        // Mark as reserved for this order
        await prisma.deviceInventoryItem.update({
          where: { id: invItem.id },
          data: { stockStatus: 'RESERVED' },
        });
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      totalAmount: order.totalAmount,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}
