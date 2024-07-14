import { dbGetProjectOwnerById } from "../models/project.models";

export const isProjectOwner = async ( zid: string, projectId: number) => {
    try {
        const owner = await dbGetProjectOwnerById(projectId);
        if (!owner) {
            return false;
        }

        if (owner.ProjectOwner.zid != zid) {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
};
