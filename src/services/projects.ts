import { PrismaClient } from "@prisma/client";
import { projectCreationInput } from "./types/projectsServiceTypes";
import ProjectItemsService from "./projectItems";

export default class ProjectsService {

    static prisma = new PrismaClient({
        log: ['query']
    })

    static async createProject(data: projectCreationInput){
        const newProject = await ProjectsService.prisma.project.create({ data });

        return newProject
    }

    static async getProject(id: string){
        let project = await ProjectsService.prisma.project.findUnique({
            where: {
                id: id,
            }
        })

        return { project }
    }

    static async getProjectsByOwner(ownerId: string){
        let projects = await ProjectsService.prisma.project.findMany({
            where: {
                ...(ownerId && {ownerId: ownerId})
            }
        });

        return { projects }
    }

    static async removeProject(id: string){

        await ProjectItemsService.removeAll(id);

        await ProjectsService.prisma.project.delete({
            where: {
                id: id
            }
        })
    }
}