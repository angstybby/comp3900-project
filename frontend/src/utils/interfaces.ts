export interface JwtUser {
  zid: string;
  email: string;
  fullname: string;
  userType: string;
}

export interface Project {
  id: number;
  title: string;
  description: string | null;
}

export interface Details {
  id: number;
  groupName: string;
  description: string;
  groupOwnerId: string;
  members: number;
  MaxMembers: number;
  groupOwnerName: string;
  CombinedSkills: string[];
}
