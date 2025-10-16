import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      hsnCode,
      description,
      rating,
      accuracy,
      helpful,
      comments,
    } = body;

    if (!hsnCode || !rating) {
      return NextResponse.json(
        { error: "HSN code and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const feedback = await prisma.hsnFeedback.create({
      data: {
        userId: session?.user?.id || null,
        hsnCode,
        description: description || null,
        rating,
        accuracy: accuracy || null,
        helpful: helpful !== null ? helpful : null,
        comments: comments || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully",
        feedbackId: feedback.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Feedback API] Error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}