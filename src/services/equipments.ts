import { PrismaClient } from "@prisma/client";

export default class EquipmentsService {

    static prisma = new PrismaClient({
        log: ['query']
    })

    static async getByType(typeId: string){
        let equipments = await EquipmentsService.prisma.equipment.findMany({
            where: {
                typeId: typeId,
            }
        })

        return { equipments }
    }

    static async getAll(){
        let equipments = await EquipmentsService.prisma.equipment.findMany();

        return { equipments }
    }
}