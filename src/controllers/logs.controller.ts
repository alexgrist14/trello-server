import { Request, Response } from "express";
import Log from "../models/Log";

export const LogsController = {
  async getAll(req: Request, res: Response) {
    const logs = await Log.findAll({ order: [["createdAt", "DESC"]] });
    res.json(logs);
  },

  async getLogsByBoard(req: Request, res: Response) {
    const { boardId } = req.params;

    const logs = await Log.findAll({
      where: { boardId },
      order: [["createdAt", "DESC"]],
      attributes: ["action", "title", "boardId", "entity", "createdAt"],
    });

    res.json(logs);
  },
};
