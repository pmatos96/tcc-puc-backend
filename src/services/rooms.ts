import { PrismaClient } from "@prisma/client";

export default class RoomsService {

    static prisma = new PrismaClient({
        log: ['query']
    })

    static async getAll(){
        let rooms = await RoomsService.prisma.room.findMany();

        return { rooms }
    }
}