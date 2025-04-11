import { IQuestion } from "../types/types";
import Question from "../models/questions";

interface UserPostRecord {
  lastPostTime: Date;
  postCount: number;
}

// 使用内存存储用户发帖记录
const userPostRecords: Map<string, UserPostRecord> = new Map();

// 限制配置
const POST_LIMIT = {
  TIME_WINDOW: 60 * 1000, // 1分钟
  MAX_POSTS: 1, // 1分钟内最多发1个问题
};

/**
 * 检查用户是否可以发帖
 * @param username 用户名
 * @returns 是否可以发帖，以及错误信息（如果有）
 */
export const canUserPost = (username: string): { canPost: boolean; error?: string } => {
  const now = new Date();
  const userRecord = userPostRecords.get(username);

  if (!userRecord) {
    return { canPost: true };
  }

  const timeSinceLastPost = now.getTime() - userRecord.lastPostTime.getTime();
  
  if (timeSinceLastPost < POST_LIMIT.TIME_WINDOW) {
    const timeLeft = Math.ceil((POST_LIMIT.TIME_WINDOW - timeSinceLastPost) / 1000);
    return { 
      canPost: false, 
      error: `You are posting too frequently. Please wait ${timeLeft} seconds before posting again.` 
    };
  }

  return { canPost: true };
};

/**
 * 更新用户发帖记录
 * @param username 用户名
 */
export const updateUserPostRecord = (username: string): void => {
  const now = new Date();
  userPostRecords.set(username, {
    lastPostTime: now,
    postCount: 1
  });
};

/**
 * 清理过期的发帖记录
 */
export const cleanupOldRecords = (): void => {
  const now = new Date();
  for (const [username, record] of userPostRecords.entries()) {
    if (now.getTime() - record.lastPostTime.getTime() > POST_LIMIT.TIME_WINDOW) {
      userPostRecords.delete(username);
    }
  }
};

// 定期清理过期的记录
setInterval(cleanupOldRecords, POST_LIMIT.TIME_WINDOW); 