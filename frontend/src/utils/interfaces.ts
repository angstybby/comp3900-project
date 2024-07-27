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
    fullname: string;
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
  Group: {
    groupName: string;
    id: number;
    groupOwnerId: string;
    MaxMembers: number;
    members: number;
    description: string;
  }[];
}

export interface ProjectListInterface {
  id: number;
  title: string;
  description: string;
  groups: {
    groupId: number;
    groupName: string;
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
  ProjectInterest: {
    groupId: number;
    projectId: number;
    status: string;
    title: string;
    description: string;
  }[];
}

export type UserType = "admin" | "student" | "academic" | null;

export type ProjectStatus = "PENDING" | "ACCEPTED" | "REJECTED" | null;
