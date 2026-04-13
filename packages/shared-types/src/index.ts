export type UserRole = "owner" | "editor" | "viewer";

export interface FamilyMember {
  id: string;
  ownerId: string;
  memberEmail: string;
  role: UserRole;
  createdAt: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  error?: string;
}
