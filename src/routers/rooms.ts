import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { ProjectItem } from "../types/types";
import RoomsController from "../controllers/rooms";

const roomsRouter: FastifyPluginAsync = async (fastify) => {

    fastify.get('/', RoomsController.getAll)
};

export default roomsRouter;
