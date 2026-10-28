export type UserRef = { username: string; avatarColor: string };

export type Post = {
  id: string;
  parentId: string | null;
  content: string;
  alias: string;
  createdAt: string;
  /** null while the post is still anonymous */
  author: UserRef | null;
  doxxed: { at: string; by: UserRef | null } | null;
  likeCount: number;
  replyCount: number;
  likedByMe: boolean;
  isMine: boolean;
};

export type Me = {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatarColor: string;
  doxTokens: number;
  createdAt: string;
  timesDoxxed: number;
  doxxesMade: number;
  unreadNotifications: number;
  nextRefillAt: string;
};

export type Profile = {
  username: string;
  bio: string;
  avatarColor: string;
  createdAt: string;
  timesDoxxed: number;
  doxxesMade: number;
};

export type Notification = {
  id: string;
  type: "doxxed" | "reply";
  postId: string | null;
  snippet: string | null;
  actor: { username: string } | null;
  readAt: string | null;
  createdAt: string;
};

export type LeaderboardEntry = UserRef & { count: number };

export const AVATAR_COLORS = [
  "#d082ff", "#ff6b9d", "#ffb84d", "#4dd4ac", "#4da6ff", "#ff7a59", "#9b8cff", "#5ce1e6",
];
