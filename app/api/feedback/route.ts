import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface FeedbackSubmission {
  isCorrect: boolean;
  rating: number;
  comments: string;
  timestamp: string;
  sessionId?: string;
  userId?: string;
  hsnCode?: string;  // NEW: Store the HSN code that was suggested
  hsnDescription?: string;  // NEW: Store the description
}

// Store feedback in a JSON file (in production, use a database)
const FEEDBACK_FILE = path.join(process.cwd(), 'data', 'feedback.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read existing feedback
function readFeedback(): FeedbackSubmission[] {
  ensureDataDirectory();
  
  if (!fs.existsSync(FEEDBACK_FILE)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading feedback file:', error);
    return [];
  }
}

// Save feedback
function saveFeedback(feedback: FeedbackSubmission[]) {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (typeof body.isCorrect !== 'boolean') {
      return NextResponse.json(
        { error: 'isCorrect field is required and must be a boolean' },
        { status: 400 }
      );
    }

    // Create feedback entry
    const feedbackEntry: FeedbackSubmission = {
      isCorrect: body.isCorrect,
      rating: body.rating || 0,
      comments: body.comments || '',
      timestamp: body.timestamp || new Date().toISOString(),
      sessionId: body.sessionId,
      userId: body.userId,
      hsnCode: body.hsnCode,  // NEW: Include HSN code
      hsnDescription: body.hsnDescription,  // NEW: Include description
    };

    // Read existing feedback
    const allFeedback = readFeedback();
    
    // Add new feedback
    allFeedback.push(feedbackEntry);
    
    // Save updated feedback
    saveFeedback(allFeedback);

    console.log('Feedback saved:', {
      isCorrect: feedbackEntry.isCorrect,
      rating: feedbackEntry.rating,
      timestamp: feedbackEntry.timestamp,
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve feedback (for analytics)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    
    const allFeedback = readFeedback();
    
    // Return most recent feedback first
    const recentFeedback = allFeedback
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    // Calculate statistics
    const stats = {
      total: allFeedback.length,
      correct: allFeedback.filter(f => f.isCorrect).length,
      incorrect: allFeedback.filter(f => !f.isCorrect).length,
      averageRating: allFeedback.length > 0
        ? (allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length).toFixed(2)
        : 0,
    };

    return NextResponse.json({
      feedback: recentFeedback,
      stats,
    });
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve feedback' },
      { status: 500 }
    );
  }
}