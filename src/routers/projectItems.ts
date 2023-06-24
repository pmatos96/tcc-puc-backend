import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { ProjectItem } from "../types/types";
import ProjectItemsController from "../controllers/projectItems";

const projectItemsRouter: FastifyPluginAsync = async (fastify) => {

    const prisma = new PrismaClient({
        log: ['query']
    })

    fastify.get('/', ProjectItemsController.getByProject)

    fastify.post('/', ProjectItemsController.saveProjectItems)    

};

export default projectItemsRouter;
