import { PrismaClient } from "@prisma/client";
import { FastifyRequest } from "fastify";

export default class ProjectsController {

    static prisma = new PrismaClient({
        log: ['query']
    })

    static createProject = async (request: FastifyRequest<{
        Body: {
            name: string
        }
    }>, response) => {
        
        const { name } = request.body;

        const newProject = await ProjectsController.prisma.project.create({
            data: {
                name,
                ownerId: "clcxsutm50000j938pytsfypo"
            }
        })

        response.status(201).send(newProject);
    }

    static removeProject = async (request: FastifyRequest<{
        Params: {
            id: string
        }
    }>) => {

        if(request?.params.id){

            await ProjectsController.prisma.projectItem.deleteMany({
                where:{
                    projectId: request.params.id
                }
            })

            await ProjectsController.prisma.project.delete({
                where: {
                    id: request.params.id
                }
            })
        }
    }

    static getProjects = async (request: FastifyRequest<{
        Params: {
            id: string
        },
        Querystring: {
            ownerId: string
        }
    }>) => {

        if(request?.params.id){
            let project = await ProjectsController.prisma.project.findUnique({
                where: {
                    id: request.params.id,
                    ...(request.query.ownerId && {ownerId: request.query.ownerId})
                }
            })

            return { project }
        }
        else{
            let projects = await ProjectsController.prisma.project.findMany({
                where: {
                    ...(request.query.ownerId && {ownerId: request.query.ownerId})
                }
            });

            return { projects }
        }
    }
}