import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { ProjectItem } from "../types/types";
import ProjectItemsService from "../services/projectItems";

export default class ProjectItemsController {

    static prisma = new PrismaClient({
        log: ['query']
    })

    static getByProject = async (request: FastifyRequest<{
        Params: {
            projectId: string
        }
    }>) => {

        let projectItems = await ProjectItemsService.getByProject(request.params.projectId);

        return projectItems;
    }

    static saveProjectItems = async (request: FastifyRequest<{
        Params: {
            projectId: string
        },
        Body: {
            projectItems: ProjectItem[]
        }
    }>, response: FastifyReply) => {

        const { projectId } = request.params;

        try{

            let newProjectItems = await ProjectItemsService.saveProjectItems(projectId, request.body.projectItems);
            
            response.status(201).send(newProjectItems);
        }
        catch(err){
            response.status(400).send({error: "Houve um erro ao tentar salvar os itens da instalação:\n\n" + err});
        }

    }
}