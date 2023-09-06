import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      }
    });

    return NextResponse.json(store);
  } catch (error:any) {
    console.log('[STORES_POST]', error);
    if (error.code === 'P2024') {
      // Custom message for network issues
      return new NextResponse('Network issue. Please try again later.', { status: 500 })
    }
    return new NextResponse("Internal error", { status: 500 });
  }
};
