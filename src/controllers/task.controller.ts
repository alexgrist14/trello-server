import { Request, Response } from "express";
import Task from "../models/Task";
import sequelize from "../config/sequelize";
import { NotFoundError } from "../errors/NotFoundError";
import { logAction } from "../utils/logsAction";
import { Op } from "sequelize";
import List from "../models/List";

export const TaskController = {
  async create(req: Request, res: Response) {
    const { listId } = req.params;
    const { title, description } = req.body;
    const result = await sequelize.transaction(async (transaction) => {
      const list = await List.findByPk(listId, {
        transaction,
        rejectOnEmpty: new NotFoundError("List not found"),
      });
      const lastTask = await Task.findAll({
        limit: 1,
        where: { listId },
        order: [["taskOrder", "DESC"]],
        transaction,
      });
      const order = lastTask?.[0]?.taskOrder;
      const taskOrder = order === undefined ? 0 : order + 1;
      const task = await Task.create(
        { title, listId, description, taskOrder },
        { transaction }
      );
      await logAction("Task", task.id, "create", list.boardId, title);
      return task;
    });
    res.status(201).json(result.get({ plain: true }));
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, order, listId, description } = req.body;
    const result = await sequelize.transaction(async (transaction) => {
      const task = await Task.findByPk(id, {
        transaction,
        rejectOnEmpty: new NotFoundError("Task not found"),
      });
      const list = await List.findByPk(task.listId, {
        transaction,
        rejectOnEmpty: new NotFoundError("List not found"),
      });
      await task.update({ title, order, listId, description }, { transaction });
      await logAction("Task", task.id, "update", list.boardId, title);
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

      const list = await List.findByPk(task.listId, {
        transaction,
        rejectOnEmpty: new NotFoundError("List not found"),
      });

      await task.destroy({ transaction });
      await logAction("Task", task.id, "delete", list.boardId, task.title);
    });

    res.json({ message: "Task deleted" });
  },

  async reorder(req: Request, res: Response) {
    const { id } = req.params;
    const { newOrder, newListId } = req.body;

    const updatedTasks = await sequelize.transaction(async (transaction) => {
      const task = await Task.findOne({
        where: { id },
        transaction,
        rejectOnEmpty: new NotFoundError("Task not found"),
      });

      const list = await List.findByPk(task.listId, {
        transaction,
        rejectOnEmpty: new NotFoundError("List not found"),
      });

      const oldOrder = task.taskOrder;
      const oldListId = task.listId;

      const isSameList = oldListId === newListId;

      if (isSameList) {
        if (newOrder === oldOrder) {
          return await Task.findAll({
            where: { listId: oldListId },
            order: [["taskOrder", "ASC"]],
            transaction,
          });
        }

        if (newOrder > oldOrder) {
          await Task.decrement("taskOrder", {
            by: 1,
            where: {
              listId: oldListId,
              taskOrder: { [Op.gt]: oldOrder, [Op.lte]: newOrder },
            },
            transaction,
          });
        } else {
          await Task.increment("taskOrder", {
            by: 1,
            where: {
              listId: oldListId,
              taskOrder: { [Op.gte]: newOrder, [Op.lt]: oldOrder },
            },
            transaction,
          });
        }

        await task.update({ taskOrder: newOrder }, { transaction });
      } else {
        await Task.decrement("taskOrder", {
          by: 1,
          where: {
            listId: oldListId,
            taskOrder: { [Op.gt]: oldOrder },
          },
          transaction,
        });

        await Task.increment("taskOrder", {
          by: 1,
          where: {
            listId: newListId,
            taskOrder: { [Op.gte]: newOrder },
          },
          transaction,
        });

        await task.update(
          {
            listId: newListId,
            taskOrder: newOrder,
          },
          { transaction }
        );
      }

      await logAction("Task", task.id, "update", list.boardId, task.title);

      return await Task.findAll({
        where: { listId: newListId },
        order: [["taskOrder", "ASC"]],
        transaction,
      });
    });

    res.json(updatedTasks);
  },
};
