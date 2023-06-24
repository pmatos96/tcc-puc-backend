import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { ProjectItem } from "../types/types";
import EquipmentsController from "../controllers/equipments";

const equipmentsRouter: FastifyPluginAsync = async (fastify) => {

    const prisma = new PrismaClient({
        log: ['query']
    })

    fastify.get('/', EquipmentsController.getAll)
};

export default equipmentsRouter;
