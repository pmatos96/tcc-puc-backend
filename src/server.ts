import Fastify, { FastifyRequest } from "fastify";
import cors from '@fastify/cors';
import { PrismaClient } from "@prisma/client";
import { ProjectItem } from "./types/types";

import projectsRouter from './routers/projects';
import equipmentsRouter from "./routers/equipments";
import roomsRouter from "./routers/rooms";

const prisma = new PrismaClient({
    log: ['query']
})

async function bootstrap(){

    const fastify = Fastify({
        logger: true
    })

    await fastify.register(cors, {
        origin: true // TODO - Adaptar o domínio do front
    })

    fastify.register(projectsRouter, {prefix: '/projects'});
    fastify.register(equipmentsRouter, {prefix: '/equipments'});
    fastify.register(roomsRouter, {prefix: '/rooms'});
   
    await fastify.listen({ port: 3333 })
}

bootstrap();