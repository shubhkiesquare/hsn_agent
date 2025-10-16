import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // Log environment variable (sanitized)
    console.log('Database URL prefix:', process.env.DATABASE_URL?.substring(0, 11))
    
    // First verify database connection
    await prisma.$connect()
    
    // Then try to count users
    const count = await prisma.user.count()
    
    return NextResponse.json({ 
      status: 'connected', 
      count
    })
  } catch (error: any) {
    console.error('Database connection error:', {
      message: error.message,
      code: error.code,
      clientVersion: error.clientVersion,
      meta: error.meta
    })
    
    return NextResponse.json({ 
      error: error.message,
      code: error.code,
      clientVersion: error.clientVersion
    }, { 
      status: 500 
    })
  } finally {
    await prisma.$disconnect()
  }
}