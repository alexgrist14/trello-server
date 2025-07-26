import { Request, Response } from "express";
import Log from "../models/Log";

export const LogsController = {
  async getAll(req: Request, res: Response) {
    const logs = await Log.findAll({ order: [["createdAt", "DESC"]] });
    res.json(logs);
  },

  async getByEntity(req: Request, res: Response) {
    const { entity } = req.params;
    const logs = await Log.findAll({
      where: { entity },
      order: [["createdAt", "DESC"]],
    });
    res.json(logs);
  },
};
