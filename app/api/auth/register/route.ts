import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        preferences: {
          create: {
            theme: "system",
            language: "en"
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email } 
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ 
      error: "Database connection failed" 
    }, { status: 500 });
  }
}
