"use client";

import { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, Star, Package } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => void;
  onNewSearch: () => void;
  hsnCode?: string;  // NEW: HSN code from AI response
  hsnDescription?: string;  // NEW: Description from AI response
}

export interface FeedbackData {
  isCorrect: boolean | null;
  rating: number;
  comments: string;
  timestamp: string;
  hsnCode?: string;  // NEW: Include HSN code in feedback data
  hsnDescription?: string;  // NEW: Include description in feedback data
}

export default function FeedbackModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  onNewSearch,
  hsnCode,
  hsnDescription
}: FeedbackModalProps) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comments, setComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (isCorrect === null) {
      alert('Please indicate if the HSN code is correct or incorrect');
      return;
    }

    setIsSubmitting(true);
    
    const feedbackData: FeedbackData = {
      isCorrect,
      rating,
      comments: comments.trim(),
      timestamp: new Date().toISOString(),
      hsnCode,  // Include HSN code in feedback
      hsnDescription,  // Include description in feedback
    };

    try {
      await onSubmit(feedbackData);
      
      // Reset form
      setIsCorrect(null);
      setRating(0);
      setComments('');
      
      // Close modal and trigger new search
      onClose();
      onNewSearch();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Reset form
    setIsCorrect(null);
    setRating(0);
    setComments('');
    
    // Close modal and trigger new search
    onClose();
    onNewSearch();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                How did we do? 🎯
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Your feedback helps us improve
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* HSN Code Display - NEW SECTION */}
            {hsnCode && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-lg p-2 flex-shrink-0">
                    <Package className="text-white" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                        Suggested HSN Code
                      </span>
                    </div>
                    <div className="font-mono text-2xl font-bold text-blue-900 mb-2">
                      {hsnCode}
                    </div>
                    {hsnDescription && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {hsnDescription}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Correctness Check */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Was the HSN code suggestion correct?
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCorrect(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                    isCorrect === true
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300 text-gray-600'
                  }`}
                >
                  <ThumbsUp size={20} />
                  <span className="font-medium">Correct</span>
                </button>
                <button
                  onClick={() => setIsCorrect(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                    isCorrect === false
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-red-300 text-gray-600'
                  }`}
                >
                  <ThumbsDown size={20} />
                  <span className="font-medium">Incorrect</span>
                </button>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rate your experience (optional)
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transform transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  {rating === 1 && "😞 We'll do better"}
                  {rating === 2 && "😕 Room for improvement"}
                  {rating === 3 && "😊 Good"}
                  {rating === 4 && "😄 Great!"}
                  {rating === 5 && "🤩 Excellent!"}
                </p>
              )}
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional comments (optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tell us more about your experience..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {comments.length}/500 characters
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip for now
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isCorrect === null}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Submitting...
                </span>
              ) : (
                'Submit & Start New Search'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}