import { PrismaClient } from "@prisma/client";
import { FastifyRequest } from "fastify";

export default class EquipmentsController {

    static prisma = new PrismaClient({
        log: ['query']
    })

    static getAll = async (request: FastifyRequest<{
        Querystring: {
            typeId: string
        }
    }>) => {
        let typeId = request.query.typeId;

        const equipments = await EquipmentsController.prisma.equipment.findMany({
            where: typeId ? { typeId } : undefined,
        });

        return { equipments }
    }
}