import { PrismaClient } from "@prisma/client";
import { FastifyRequest } from "fastify";
import RoomsService from "../services/rooms";

export default class RoomsController {

    static getAll = async (request: FastifyRequest) => {

        let rooms = await RoomsService.getAll();

        return rooms;
    }
}