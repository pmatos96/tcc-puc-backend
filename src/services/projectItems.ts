import { PrismaClient } from "@prisma/client";
import { ProjectItem } from "../types/types";

export default class ProjectItemsService {

    static prisma = new PrismaClient({
        log: ['query']
    })

    static async getByProject(projectId: string){

        let projectItems = await ProjectItemsService.prisma.projectItem.findMany({
            where: {
                projectId: projectId
            }
        })

        return { projectItems }
    }

    static async removeAll(projectId: string){

        await ProjectItemsService.prisma.projectItem.deleteMany({
            where:{
                projectId
            }
        })
    }

    private static prepareProjectItemsByBoardType(projectItems: ProjectItem[]){
        return Object.entries(projectItems).map(entry => {

            let items = (entry[1] || []).map(item => {
                return {
                    ...item,
                    boardType: entry[0]
                }
            })
            return items
        }).flat();
    }

    static async saveProjectItems(projectId: string, projectItems: ProjectItem[]){

        await this.removeAll(projectId);

        let preparedProjectItemsByBoardType = this.prepareProjectItemsByBoardType(projectItems);

        let newProjectItems: Array<Object> = [];

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

            const newProjectItem = await ProjectItemsService.prisma.projectItem.create({
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

        return newProjectItems;
    }
}