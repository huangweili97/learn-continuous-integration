import { getMetaData } from "../../../utils";
import Answer from "./answer/answerView";
import AnswerHeader from "./header/headerView";
import "./answerPageView.css";
import QuestionBody from "./questionBody/questionBodyView";
import { VoidFunctionType } from "../../../types/functionTypes";
import { useAnswerPage } from "../../../hooks/useAnswerPage";

// The type of the props for the AnswerPage component
interface AnswerPageProps {
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
}

/**
 * The component renders all the answers for a question.
 * It uses a hook to fetch the question and its answers.
 * @param props contains the qid, handleNewQuestion and handleNewAnswer functions 
 * which are used by the new question and anwer forms 
 * @returns the AnswerPage component
 */
const AnswerPage = ({
  qid,
  handleNewQuestion,
  handleNewAnswer,
}: AnswerPageProps) => {
  const { question } = useAnswerPage(qid);

  if (!question) {
    return null;
  }

  return (
    <>
      <AnswerHeader
        ansCount={question.answers.length}
        title={question.title}
        handleNewQuestion={handleNewQuestion}
      />
      <QuestionBody
        views={question.views}
        text={question.text}
        askby={question.asked_by}
        meta={getMetaData(new Date(question.ask_date_time))}
      />
      {question.answers.map((a, idx) => (
        <Answer
          key={a._id}
          _id={a._id || ''}
          text={a.text}
          ans_by={a.ans_by}
          ans_date_time={typeof a.ans_date_time === 'string' ? a.ans_date_time : a.ans_date_time.toISOString()}
          upvoteCount={a.upvoteCount || 0}
          downvoteCount={a.downvoteCount || 0}
          meta={getMetaData(new Date(a.ans_date_time))}
        />
      ))}
      <button
        className="bluebtn ansButton"
        onClick={() => {
          handleNewAnswer();
        }}
      >
        Answer Question
      </button>
    </>
  );
};

export default AnswerPage;
