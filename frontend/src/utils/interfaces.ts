export interface JwtUser {
  zid: string;
  email: string;
  fullname: string;
  userType: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  ProjectOwner: {
    zid: string;
  };
  skills: {
    id: number;
    skillName: string;
  }[];
  ProjectInterest: {
    groupId: number;
    projectId: number;
    status: string;
  }[];
  groups: {
    groupName: string;
    groupId: number;
  }[];
}

export interface ProjectCardStudent {
  id: number;
  title: string;
  description: string;
  groups: {
    groupId: number;
    groupName: string;
  }[];
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
  Project: Project[];
}

export type UserType = "admin" | "student" | "academic" | null;

export type ProjectStatus = "PENDING" | "ACCEPTED" | "REJECTED" | null;
