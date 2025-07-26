import { Request, Response } from "express";
import Task from "../models/Task";
import sequelize from "../config/sequelize";
import { NotFoundError } from "../errors/NotFoundError";
import { logAction } from "../utils/logsAction";
import { Op } from "sequelize";
interface ReorderTaskDTO {
  id: number;
  order: number;
  listId: number;
}

export const TaskController = {
  async create(req: Request, res: Response) {
    const { listId } = req.params;
    const { title, description } = req.body;
    const result = await sequelize.transaction(async (transaction) => {
      const lastTask = await Task.findAll({
        limit: 1,
        where: { listId },
        order: [["createdAt", "DESC"]],
        transaction,
      });
      const order = lastTask?.[0]?.taskOrder;
      const taskOrder = order === undefined ? 0 : order + 1;
      const task = await Task.create(
        { title, listId, description, taskOrder },
        { transaction }
      );
      await logAction("Task", task.id, "create");
      return task;
    });
    res.status(201).json(result.get({ plain: true }));
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, order, listId } = req.body;
    const result = await sequelize.transaction(async (transaction) => {
      const task = await Task.findByPk(id, {
        transaction,
        rejectOnEmpty: new NotFoundError("Task not found"),
      });
      await task.update({ title, order, listId }, { transaction });
      await logAction("Task", task.id, "update");
      return task;
    });

    res.json(result.get({ plain: true }));
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const result = await sequelize.transaction(async (transaction) => {
      const task = await Task.findByPk(id, {
        rejectOnEmpty: new NotFoundError("Task not found"),
      });

      await task.destroy({ transaction });
      await logAction("Task", task.id, "delete");
    });

    res.json({ message: "Task deleted" });
  },

  async reorder(req: Request, res: Response) {
    const { id } = req.params;
    const { newOrder } = req.body;

    const updatedTasks = await sequelize.transaction(async (transaction) => {
      const task = await Task.findOne({
        where: { id },
        transaction,
        rejectOnEmpty: new NotFoundError("Task not found"),
      });

      const oldOrder = task.taskOrder;

      if (newOrder === oldOrder) {
        return await Task.findAll({
          where: { listId: task.listId },
          order: [["taskOrder", "ASC"]],
          transaction,
        });
      }

      if (newOrder > oldOrder) {
        await Task.decrement("taskOrder", {
          by: 1,
          where: {
            listId: task.listId,
            taskOrder: { [Op.gt]: oldOrder, [Op.lte]: newOrder },
          },
          transaction,
        });
      } else {
        await Task.increment("taskOrder", {
          by: 1,
          where: {
            listId: task.listId,
            taskOrder: { [Op.gte]: newOrder, [Op.lt]: oldOrder },
          },
          transaction,
        });
      }

      await task.update({ taskOrder: newOrder }, { transaction });
      await logAction("Task", task.id, "update");

      return await Task.findAll({
        where: { listId: task.listId },
        order: [["taskOrder", "ASC"]],
        transaction,
      });
    });

    res.json(updatedTasks);
  },
};
