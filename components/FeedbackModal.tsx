"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  hsnCode: string;
  hsnDescription: string;
  onSubmit: (feedback: FeedbackData) => void;
}

export interface FeedbackData {
  hsnCode: string;
  description: string;
  rating: number;
  accuracy: "accurate" | "partially_accurate" | "inaccurate" | "";
  helpful: boolean | null;
  comments: string;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  hsnCode,
  hsnDescription,
  onSubmit,
}: FeedbackModalProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<"accurate" | "partially_accurate" | "inaccurate" | "">("");
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comments, setComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please provide a rating before submitting");
      return;
    }

    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      hsnCode,
      description: hsnDescription,
      rating,
      accuracy,
      helpful,
      comments,
    };

    try {
      await onSubmit(feedbackData);
      // Reset form
      setRating(0);
      setAccuracy("");
      setHelpful(null);
      setComments("");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setRating(0);
    setAccuracy("");
    setHelpful(null);
    setComments("");
    onClose();
  };

  return (
    <div className="feedback-modal-overlay" onClick={handleSkip}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-modal-header">
          <h2>📊 Help Us Improve!</h2>
          <p className="feedback-subtitle">
            You've received {hsnCode ? "5" : "multiple"} HSN classifications. Your feedback helps us serve you better.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* HSN Code Display */}
          {hsnCode && (
            <div className="feedback-hsn-display">
              <div className="feedback-hsn-code">
                <strong>Latest HSN Code:</strong> {hsnCode}
              </div>
              {hsnDescription && (
                <div className="feedback-hsn-desc">{hsnDescription}</div>
              )}
            </div>
          )}

          {/* Rating Stars */}
          <div className="feedback-field">
            <label className="feedback-label">
              How satisfied are you with the HSN classifications? *
            </label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${
                    star <= (hoveredRating || rating) ? "filled" : ""
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
              <span className="rating-text">
                {rating === 0
                  ? "Select a rating"
                  : rating === 1
                  ? "Poor"
                  : rating === 2
                  ? "Fair"
                  : rating === 3
                  ? "Good"
                  : rating === 4
                  ? "Very Good"
                  : "Excellent"}
              </span>
            </div>
          </div>

          {/* Accuracy Assessment */}
          <div className="feedback-field">
            <label className="feedback-label">
              How accurate were the HSN codes provided?
            </label>
            <div className="accuracy-options">
              <button
                type="button"
                className={`accuracy-btn ${accuracy === "accurate" ? "selected" : ""}`}
                onClick={() => setAccuracy("accurate")}
              >
                ✅ Accurate
              </button>
              <button
                type="button"
                className={`accuracy-btn ${accuracy === "partially_accurate" ? "selected" : ""}`}
                onClick={() => setAccuracy("partially_accurate")}
              >
                ⚠️ Partially Accurate
              </button>
              <button
                type="button"
                className={`accuracy-btn ${accuracy === "inaccurate" ? "selected" : ""}`}
                onClick={() => setAccuracy("inaccurate")}
              >
                ❌ Inaccurate
              </button>
            </div>
          </div>

          {/* Helpfulness */}
          <div className="feedback-field">
            <label className="feedback-label">
              Did the assistant's explanations help you understand the classification?
            </label>
            <div className="helpful-options">
              <button
                type="button"
                className={`helpful-btn ${helpful === true ? "selected" : ""}`}
                onClick={() => setHelpful(true)}
              >
                👍 Yes, very helpful
              </button>
              <button
                type="button"
                className={`helpful-btn ${helpful === false ? "selected" : ""}`}
                onClick={() => setHelpful(false)}
              >
                👎 Not helpful
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="feedback-field">
            <label className="feedback-label">
              Additional comments or suggestions (optional)
            </label>
            <textarea
              className="feedback-textarea"
              rows={4}
              placeholder="Tell us more about your experience, any issues you encountered, or suggestions for improvement..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              maxLength={500}
            />
            <div className="character-count">{comments.length}/500</div>
          </div>

          {/* User Info Display */}
          {session?.user && (
            <div className="feedback-user-info">
              Feedback will be submitted as: <strong>{session.user.email}</strong>
            </div>
          )}

          {/* Action Buttons */}
          <div className="feedback-actions">
            <button
              type="button"
              className="btn-skip"
              onClick={handleSkip}
              disabled={isSubmitting}
            >
              Skip
            </button>
            <button
              type="submit"
              className="btn-submit-feedback"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>
        </form>

        <button
          className="modal-close-btn"
          onClick={handleSkip}
          aria-label="Close modal"
          disabled={isSubmitting}
        >
          ×
        </button>
      </div>
    </div>
  );
}