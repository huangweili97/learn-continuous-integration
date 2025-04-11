import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UseVoteProps {
  initialUpvoteCount: number;
  initialDownvoteCount: number;
  onVoteUpdate?: () => void;
}

interface UseVoteReturn {
  localUpvoteCount: number;
  localDownvoteCount: number;
  voteError: string | null;
  handleUpvote: (e: React.MouseEvent, voteFunction: (id: string) => Promise<any>, id: string) => Promise<void>;
  handleDownvote: (e: React.MouseEvent, voteFunction: (id: string) => Promise<any>, id: string) => Promise<void>;
}

/**
 * 处理点赞点踩的状态管理hook
 * @param initialUpvoteCount 初始点赞数
 * @param initialDownvoteCount 初始点踩数
 * @param onVoteUpdate 投票更新后的回调函数
 * @returns 投票相关的状态和处理函数
 */
export const useVote = ({
  initialUpvoteCount,
  initialDownvoteCount,
  onVoteUpdate
}: UseVoteProps): UseVoteReturn => {
  const { isAuthenticated } = useAuth();
  const [localUpvoteCount, setLocalUpvoteCount] = useState(initialUpvoteCount);
  const [localDownvoteCount, setLocalDownvoteCount] = useState(initialDownvoteCount);
  const [voteError, setVoteError] = useState<string | null>(null);

  const handleUpvote = async (
    e: React.MouseEvent,
    voteFunction: (id: string) => Promise<any>,
    id: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setVoteError("请先登录后再投票");
      return;
    }

    try {
      const response = await voteFunction(id);
      if (response && response.upvoteCount !== undefined) {
        setLocalUpvoteCount(response.upvoteCount);
        setVoteError(null);
      } else {
        setLocalUpvoteCount(prev => prev + 1);
      }
      if (onVoteUpdate) {
        onVoteUpdate();
      }
    } catch (error) {
      console.error("Error upvoting:", error);
      setVoteError("投票失败，请稍后重试");
    }
  };

  const handleDownvote = async (
    e: React.MouseEvent,
    voteFunction: (id: string) => Promise<any>,
    id: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setVoteError("请先登录后再投票");
      return;
    }

    try {
      const response = await voteFunction(id);
      if (response && response.downvoteCount !== undefined) {
        setLocalDownvoteCount(response.downvoteCount);
        setVoteError(null);
      } else {
        setLocalDownvoteCount(prev => prev + 1);
      }
      if (onVoteUpdate) {
        onVoteUpdate();
      }
    } catch (error) {
      console.error("Error downvoting:", error);
      setVoteError("投票失败，请稍后重试");
    }
  };

  return {
    localUpvoteCount,
    localDownvoteCount,
    voteError,
    handleUpvote,
    handleDownvote
  };
}; 