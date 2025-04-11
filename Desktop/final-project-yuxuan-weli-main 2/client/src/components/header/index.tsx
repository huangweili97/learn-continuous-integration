import "./index.css";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { QuestionsPageQueryFuntionType } from "../../types/functionTypes";
import SignUpModal from "../main/auth/SignUpModal";
import LoginModal from "../main/auth/LoginModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// A type definition for the props of the Header component
interface HeaderProps {
  search: string;
  setQuestionPage: QuestionsPageQueryFuntionType;
}

/**
 * The header component for the Fake Stack Overflow application.
 * It is composed of a title and a search bar.
 * When the user types in the search bar and presses Enter, the page is set to display the search results.
 * @param param0 with the search string and the function to set the page to display the search results
 * @returns the header component
 */
const Header = ({ search, setQuestionPage }: HeaderProps) => {
  const [val, setVal] = useState<string>(search);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = useAuth();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuestionPage(e.currentTarget.value, "Search Results");
    }
  };

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleShowSignUp = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  const handleShowLogin = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <div id="header" className="header">
        <div className="header-left">
          <div className="title">Fake Stack Overflow</div>
        </div>
        <div className="header-right">
          <input
            id="searchBar"
            placeholder="Search ..."
            type="text"
            value={val}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <div className="button-group">
            {isAuthenticated ? (
              <>
                <span className="username-display">Welcome, {username}</span>
                <button className="bluebtn" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <button className="bluebtn" onClick={handleLogin}>Log in</button>
                <button className="bluebtn" onClick={() => setIsSignUpModalOpen(true)}>Sign up</button>
              </>
            )}
          </div>
        </div>
      </div>
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)} 
        onShowLogin={handleShowLogin}
      />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onShowSignUp={handleShowSignUp}
      />
    </>
  );
};

export default Header;
