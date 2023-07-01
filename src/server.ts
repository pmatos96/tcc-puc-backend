import Fastify, { FastifyRequest } from "fastify";
import cors from '@fastify/cors';
import { PrismaClient } from "@prisma/client";

import projectsRouter from './routers/projects';
import equipmentsRouter from "./routers/equipments";
import roomsRouter from "./routers/rooms";

async function bootstrap(){

    const fastify = Fastify({
        logger: true
    })

    await fastify.register(cors, {
        origin: true
    })

    fastify.register(projectsRouter, {prefix: '/projects'});
    fastify.register(equipmentsRouter, {prefix: '/equipments'});
    fastify.register(roomsRouter, {prefix: '/rooms'});
   
    await fastify.listen({ port: 3333 })
}

bootstrap();