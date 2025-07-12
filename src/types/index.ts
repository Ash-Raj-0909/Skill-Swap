export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  totalSwaps: number;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  swapId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}