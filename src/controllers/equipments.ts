import { PrismaClient } from "@prisma/client";
import { FastifyRequest } from "fastify";
import EquipmentsService from "../services/equipments";

export default class EquipmentsController {

    static getAll = async (request: FastifyRequest<{
        Querystring: {
            typeId: string
        }
    }>) => {
        let typeId = request.query.typeId;

        const equipments = typeId ? await EquipmentsService.getByType(typeId) : await EquipmentsService.getAll();

        return equipments;
    }
}