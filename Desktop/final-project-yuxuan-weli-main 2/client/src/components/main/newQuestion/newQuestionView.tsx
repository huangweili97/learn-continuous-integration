import Form from "../baseComponents/form/formView";
import Input from "../baseComponents/input/inputView";
import Textarea from "../baseComponents/textarea/textAreaView";
import { useNewQuestion } from "../../../hooks/useNewQuestion";
import { VoidFunctionType } from "../../../types/functionTypes";
import { useAuth } from "../../../contexts/AuthContext";
import LoginModal from "../auth/LoginModal";
import SignUpModal from "../auth/SignUpModal";
import { useState } from "react";
import "./newQuestionView.css";

// Type definition for props passed to NewQuestion component
interface NewQuestionProps {
  handleQuestions: VoidFunctionType;
}

/**
 * The component renders the form for posting a new question.
 * It uses the useNewQuestion hook to manage the state of the form 
 * and to save the new question to the database. After saving the
 * question, it calls the handleQuestions function to update the view.
 * @param props contains the handleQuestions function to update the view which renders the new question 
 * @returns the NewQuestion component.
 */
const NewQuestion = ({ handleQuestions }: NewQuestionProps) => {
  const { isAuthenticated, username } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const {
    title,
    setTitle,
    text,
    setText,
    tag,
    setTag,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
  } = useNewQuestion(handleQuestions);

  const handlePostQuestion = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    postQuestion();
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required-container">
        <h2>Authentication Required</h2>
        <p>You need to be logged in to ask questions.</p>
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          message="Please log in to ask questions"
        />
        <SignUpModal 
          isOpen={showSignUpModal} 
          onClose={() => setShowSignUpModal(false)}
        />
      </div>
    );
  }

  return (
    <>
      <Form>
        <Input
          title={"Question Title"}
          hint={"Limit title to 100 characters or less"}
          id={"formTitleInput"}
          val={title}
          setState={setTitle}
          err={titleErr}
        />
        <Textarea
          title={"Question Text"}
          hint={"Add details"}
          id={"formTextInput"}
          val={text}
          setState={setText}
          err={textErr}
        />
        <Input
          title={"Tags"}
          hint={"Add keywords separated by whitespace"}
          id={"formTagInput"}
          val={tag}
          setState={setTag}
          err={tagErr}
        />
        <div className="btn_indicator_container">
          <button className="form_postBtn" onClick={handlePostQuestion}>
            Post Question
          </button>
          <div className="mandatory_indicator">* indicates mandatory fields</div>
        </div>
      </Form>
    </>
  );
};

export default NewQuestion;
