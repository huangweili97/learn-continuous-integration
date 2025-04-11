import React from "react";
import { upvoteQuestion, downvoteQuestion } from "../../../../services/voteService";
import "./questionView.css";
import { getMetaData } from "../../../../utils";
import {
  ClickTagFunctionType,
  IdFunctionType,
} from "../../../../types/functionTypes";
import { Tag, AnswerType } from "../../../../types/entityTypes";
import { useVote } from "../../../../hooks/useVote";

interface QuestionProps {
  q: {
    _id: string;
    answers: AnswerType[];
    views: number;
    title: string;
    text: string;
    tags: Tag[];
    asked_by: string;
    ask_date_time: string;
    upvoteCount: number;
    downvoteCount: number;
  };
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
}

/**
 * The component to render a question in the question page
 * @param props containing the question object, clickTag function, and handleAnswer function
 * @returns the Question component
 */
const Question = ({ q, clickTag, handleAnswer }: QuestionProps) => {
  const {
    localUpvoteCount,
    localDownvoteCount,
    voteError,
    handleUpvote,
    handleDownvote
  } = useVote({
    initialUpvoteCount: q.upvoteCount,
    initialDownvoteCount: q.downvoteCount
  });

  return (
    <div className="question">
      <div className="postStats">
        <div className="vote-buttons">
          <button 
            type="button" 
            className="vote-button" 
            onClick={(e) => handleUpvote(e, upvoteQuestion, q._id)}
          >
            👍 {localUpvoteCount}
          </button>
          <button 
            type="button" 
            className="vote-button" 
            onClick={(e) => handleDownvote(e, downvoteQuestion, q._id)}
          >
            👎 {localDownvoteCount}
          </button>
        </div>
      </div>
      <div className="question_mid">
        <h2 className="postTitle" onClick={() => handleAnswer(q._id)}>
          {q.title}
        </h2>
        <p className="question-text">{q.text}</p>
        <div className="question_tags">
          {q.tags.map((tag) => (
            <button
              key={tag._id}
              className="question_tag_button"
              onClick={() => clickTag(tag.name)}
            >
              {tag.name}
            </button>
          ))}
        </div>
        {voteError && <div className="vote-error">{voteError}</div>}
      </div>
      <div className="lastActivity">
        <div className="question_author">{q.asked_by}</div>
        <div className="question_meta">
          {getMetaData(new Date(q.ask_date_time))}
        </div>
      </div>
    </div>
  );
};

export default Question;
