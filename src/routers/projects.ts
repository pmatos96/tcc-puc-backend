import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import projectItemsRouter from "./projectItems";
import ProjectsController from "../controllers/projects";

const projectsRouter: FastifyPluginAsync = async (fastify) => {

    const prisma = new PrismaClient({
        log: ['query']
    })

    fastify.get('/:id', ProjectsController.getProjects)

    fastify.post('/', ProjectsController.createProject)

    fastify.delete('/:id', ProjectsController.removeProject)

    fastify.register(projectItemsRouter, {prefix: '/:id/items'});
};

export default projectsRouter;
