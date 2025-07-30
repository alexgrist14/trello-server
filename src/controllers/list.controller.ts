import { Request, Response } from "express";
import List from "../models/List";
import sequelize from "../config/sequelize";
import { NotFoundError } from "../errors/NotFoundError";
import { logAction } from "../utils/logsAction";
import Task from "../models/Task";

export const ListController = {
  async getAll(req: Request, res: Response) {
    const { boardId } = req.params;
    const lists = await List.findAll({
      where: { boardId },
      include: { model: Task },
    });
    res.json(lists);
  },

  async create(req: Request, res: Response) {
    const { title } = req.body;
    const { boardId } = req.params;
    const result = await sequelize.transaction(async (transaction) => {
      const list = await List.create({ title, boardId }, { transaction });
      return list;
    });

    await logAction("List", result.id, "create", +boardId, result.title);

    res.status(201).json(result.get());
  },

  async update(req: Request, res: Response) {
    const { title } = req.body;
    const { id } = req.params;
    const result = await sequelize.transaction(async (transaction) => {
      const list = await List.findByPk(id, {
        transaction,
        rejectOnEmpty: new NotFoundError("List not found"),
      });
      await list.update({ title });

      return list;
    });

    await logAction("List", result.id, "update", result.boardId, result.title);

    res.json(result.get());
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const result = await sequelize.transaction(async (transaction) => {
      const list = await List.findByPk(id, {
        rejectOnEmpty: new NotFoundError("List not found"),
      });
      await list.destroy({ transaction });
      return list;
    });
    await logAction("List", result.id, "delete", result.boardId, result.title);

    res.json({ message: "List deleted" });
  },
};
