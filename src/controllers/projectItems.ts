import { PrismaClient } from "@prisma/client";
import { FastifyRequest } from "fastify";

export default class ProjectItemsController {

    static prisma = new PrismaClient({
        log: ['query']
    })

    static getByProject = async (request: FastifyRequest<{
        Params: {
            projectId: string
        }
    }>) => {

        let projectItems = await ProjectItemsController.prisma.projectItem.findMany({
            where: {
                projectId: request.params.projectId
            }
        })

        return { projectItems }
    }

    static saveProjectItems = async (request: FastifyRequest<{
        Params: {
            projectId: string
        },
        Body: ProjectItem[]
    }>, response) => {

        const { projectId } = request.params;

        await ProjectItemsController.prisma.projectItem.deleteMany({
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

            const newProjectItem = await ProjectItemsController.prisma.projectItem.create({
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

    }
}