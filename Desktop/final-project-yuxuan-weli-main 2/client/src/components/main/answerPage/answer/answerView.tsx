import React from "react";
import { upvoteAnswer, downvoteAnswer } from "../../../../services/voteService";
import "./answerView.css";
import { useVote } from "../../../../hooks/useVote";

// The type definition for the props of the Answer component
interface AnswerProps {
  _id: string;
  text: string;
  ans_by: string;
  ans_date_time: string;
  upvoteCount: number;
  downvoteCount: number;
  meta: string;
  onVoteUpdate?: () => void;
}

/**
 * The component to render an answer in the answer page
 * @param props containing the answer text, the author of the answer, the date and time of the answer, the upvote count, the downvote count, and an optional onVoteUpdate function
 * @returns the Answer component
 */
const Answer = ({
  _id,
  text,
  ans_by,
  ans_date_time,
  upvoteCount,
  downvoteCount,
  meta,
  onVoteUpdate
}: AnswerProps) => {
  const {
    localUpvoteCount,
    localDownvoteCount,
    voteError,
    handleUpvote,
    handleDownvote
  } = useVote({
    initialUpvoteCount: upvoteCount,
    initialDownvoteCount: downvoteCount,
    onVoteUpdate
  });

  return (
    <div className="answer">
      <div className="vote-buttons">
        <button 
          type="button" 
          className="vote-button" 
          onClick={(e) => handleUpvote(e, upvoteAnswer, _id)}
        >
          👍 {localUpvoteCount}
        </button>
        <button 
          type="button" 
          className="vote-button" 
          onClick={(e) => handleDownvote(e, downvoteAnswer, _id)}
        >
          👎 {localDownvoteCount}
        </button>
      </div>
      <div className="answer-content">
        <p className="answer-text">{text}</p>
        <div className="answer-meta">
          <span>回答者: {ans_by}</span>
          <span>回答时间: {new Date(ans_date_time).toLocaleString()}</span>
        </div>
        {voteError && <div className="vote-error">{voteError}</div>}
      </div>
    </div>
  );
};

export default Answer;
