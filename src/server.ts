import Fastify from "fastify";
import cors from '@fastify/cors';
import { PrismaClient } from "@prisma/client";


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

    fastify.get('/equipments', async () => {

        const equipments = await prisma.equipment.findMany();

        return { equipments }
    })

    await fastify.listen({ port: 3333 })
}

bootstrap();