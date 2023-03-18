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

    fastify.post('/projects/', async (request: FastifyRequest<{
        Body: {
            name: string
        }
    }>, response) => {
        
        const { name } = request.body;

        const newProject = await prisma.project.create({
            data: {
                name,
                ownerId: "clcxsutm50000j938pytsfypo"
            }
        })

        response.status(201).send(newProject);
    })

    fastify.get('/equipments/', async (request: FastifyRequest<{
        Querystring: {
            typeId: string
        }
    }>) => {
        let typeId = request.query.typeId;

        const equipments = await prisma.equipment.findMany({
            where: typeId ? { typeId } : undefined,
        });

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

    fastify.get('/rooms/', async (request: FastifyRequest) => {

        let rooms = await prisma.room.findMany();

        return { rooms }
    })

    await fastify.listen({ port: 3333 })
}

bootstrap();