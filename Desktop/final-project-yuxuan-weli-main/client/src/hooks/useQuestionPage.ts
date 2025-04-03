import { useEffect, useState } from "react";
import { getQuestionsByFilter } from "../services/questionService";
import { QuestionResponseType } from "../types/entityTypes";

// A type for the input to the useQuestionPage hook
interface UseQuestionPageProps {
  order: string;
  search: string;
}

/**
 * A custom hook to handle the state and logic for fetching questions based on the filter parameters.
 * The hook interacts with the question service to fetch questions based on the order and search query entered by the user.
 * @param props containing the order and search query entered by the user 
 * @returns the list of questions fetched based on the filter parameters
 */
export const useQuestionPage = ({ order, search }: UseQuestionPageProps) => {
  const [qlist, setQlist] = useState<QuestionResponseType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /**
   * The effect to fetch questions based on the filter parameters.
   * 
   * the effect runs when the order or search query changes.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionsByFilter(order, search);
        setQlist(res || []);
        setCurrentPage(1); // Reset to first page when search or order changes
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();
  }, [order, search]);

  // Calculate pagination values
  const totalPages = Math.ceil(qlist.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestions = qlist.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return { 
    qlist: currentQuestions,
    currentPage,
    totalPages,
    goToPage
  };
};
