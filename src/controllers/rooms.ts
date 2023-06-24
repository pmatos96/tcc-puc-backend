import { PrismaClient } from "@prisma/client";
import { FastifyRequest } from "fastify";

export default class RoomsController {

    static prisma = new PrismaClient({
        log: ['query']
    })

    static getAll = async (request: FastifyRequest) => {

        let rooms = await RoomsController.prisma.room.findMany();

        return { rooms }
    }
}