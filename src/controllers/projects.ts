import { PrismaClient } from "@prisma/client";
import { FastifyRequest } from "fastify";
import ProjectsService from "../services/projects";

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

        const newProject = await ProjectsService.createProject({
            name,
            ownerId: "clcxsutm50000j938pytsfypo" // Usuário único setado provisoriamente
        })

        response.status(201).send(newProject);
    }

    static removeProject = async (request: FastifyRequest<{
        Params: {
            id: string
        }
    }>, response) => {

        if(request?.params?.id){

            await ProjectsService.removeProject(request.params.id)
        }
        else{
            response.status(400).json({ error: 'Nenhum id informado.' });
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
            let project = await ProjectsService.getProject(request.params.id)

            return project;
        }
        else{
            let projects = await ProjectsService.getProjectsByOwner(request.query.ownerId)

            return projects;
        }
    }
}