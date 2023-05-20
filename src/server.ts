import Fastify, { FastifyRequest } from "fastify";
import cors from '@fastify/cors';
import { PrismaClient } from "@prisma/client";
import { ProjectItem } from "./types/types";


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

    fastify.delete('/projects/:id', async (request: FastifyRequest<{
        Params: {
            id: string
        }
    }>) => {

        if(request?.params.id){

            await prisma.projectItem.deleteMany({
                where:{
                    projectId: request.params.id
                }
            })

            await prisma.project.delete({
                where: {
                    id: request.params.id
                }
            })
        }
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

    fastify.get('/projects/:projectId/items', async (request: FastifyRequest<{
        Params: {
            projectId: string
        }
    }>) => {

        let projectItems = await prisma.projectItem.findMany({
            where: {
                projectId: request.params.projectId
            }
        })

        return { projectItems }
    })

    fastify.post('/projects/:projectId/items', async (request: FastifyRequest<{
        Params: {
            projectId: string
        },
        Body: ProjectItem[]
    }>, response) => {

        const { projectId } = request.params;

        await prisma.projectItem.deleteMany({
            where:{
                projectId
            }
        })

        const projectItems = request.body.projectItems;

        let preparedProjectItemsByBoardType = Object.entries(projectItems).map(entry => {

            let items = (entry[1] || []).map(item => {
                return {
                    ...item,
                    boardType: entry[0]
                }
            })
            return items
        }).flat();

        let newProjectItems = [];

        let operations = preparedProjectItemsByBoardType.map(async item => {

            const {
                equipmentId, 
                power, 
                amount, 
                roomId, 
                phasesNumber, 
                voltage, 
                current,
                boardType
            } = item;

            const newProjectItem = await prisma.projectItem.create({
                data: {
                    projectId,
                    equipmentId, 
                    power: parseInt(power),
                    amount: parseInt(amount), 
                    roomId, 
                    phasesNumber: parseInt(phasesNumber || 1),
                    boardType
                }
            })
            newProjectItems.push(newProjectItem)
        })
        

        await Promise.all(operations);

        response.status(201).send(newProjectItems);

    })

    fastify.get('/rooms/', async (request: FastifyRequest) => {

        let rooms = await prisma.room.findMany();

        return { rooms }
    })

    await fastify.listen({ port: 3333 })
}

bootstrap();