import { dbGetProjectOwnerById } from "../models/project.models";

export const isProjectOwner = async (zid: string, projectId: number) => {
    try {
        const owner = await dbGetProjectOwnerById(projectId);
        if (!owner) {
            return false;
        }

        console.log(owner.ProjectOwner.zid, zid);
        if (owner.ProjectOwner.zid !== zid) {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
};

export interface Project {
    id: number;
    title: string;
    description: string | null;
}

export interface CombinedProject {
    id: number;
    title: string;
    description: string | null;
    projectOwnerId: string;
    skills?: string[];
}
