import Fastify, { FastifyRequest } from "fastify";
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

    fastify.get('/projects/:id', async (request: FastifyRequest<{
        Params: {
            id: string
        },
        Querystring: {
            ownerId: string
        }
    }>) => {

        if(request?.params.id){
            let project = await prisma.project.findUnique({
                where: {
                    id: request.params.id,
                    ...(request.query.ownerId && {ownerId: request.query.ownerId})
                }
            })

            return { project }
        }
        else{
            let projects = await prisma.project.findMany({
                where: {
                    ...(request.query.ownerId && {ownerId: request.query.ownerId})
                }
            });

            return { projects }
        }
    })

    fastify.get('/projects/:id/items', async (request: FastifyRequest<{
        Params: {
            id: string
        }
    }>) => {

        let projectItems = await prisma.projectItem.findMany({
            where: {
                projectId: request.params.id
            }
        })

        return { projectItems }
    })

    await fastify.listen({ port: 3333 })
}

bootstrap();