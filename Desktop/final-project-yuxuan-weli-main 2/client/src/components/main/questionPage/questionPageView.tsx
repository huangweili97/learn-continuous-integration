import "./questionPageView.css";
import QuestionHeader from "./header/headerView";
import Question from "./question/questionView";
import { useQuestionPage } from "../../../hooks/useQuestionPage";
import Pagination from "../baseComponents/pagination";
import {
  ClickTagFunctionType,
  VoidFunctionType,
  IdFunctionType,
  OrderFunctionType,
} from "../../../types/functionTypes";

export interface QuestionPageProps {
  title_text?: string;
  order: string;
  search: string;
  setQuestionOrder: OrderFunctionType;
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
  handleNewQuestion: VoidFunctionType;
}

const QuestionPage = ({
  title_text = "All Questions",
  order,
  search,
  setQuestionOrder,
  clickTag,
  handleAnswer,
  handleNewQuestion,
}: QuestionPageProps) => {
  const { qlist, currentPage, totalPages, goToPage } = useQuestionPage({ order, search });

  return (
    <>
      <QuestionHeader
        title_text={title_text}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />
      <div id="question_list" className="question_list">
        {qlist.map((q) => (
          <Question
            q={q}
            key={q._id}
            clickTag={clickTag}
            handleAnswer={handleAnswer}
          />
        ))}
      </div>
      {title_text === "Search Results" && !qlist.length && (
        <div className="bold_title right_padding">No Questions Found</div>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </>
  );
};

export default QuestionPage;
