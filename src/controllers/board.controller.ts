import { Request, Response, NextFunction } from "express";
import Board from "../models/Board";
import List from "../models/List";
import Task from "../models/Task";
import { NotFoundError } from "../errors/NotFoundError";
import sequelize from "../config/sequelize";

export const BoardController = {
  async getAll(req: Request, res: Response) {
    const boards = await Board.findAll({
      include: { model: List, include: [Task] },
      order: [["createdAt", "ASC"]],
    });
    res.json(boards);
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    const board = await Board.findByPk(req.params.id, {
      include: {
        model: List,
        include: [
          {
            model: Task,
            separate: true,
            order: [["taskOrder", "ASC"]],
          },
        ],
      },
      rejectOnEmpty: new NotFoundError("Board not found"),
    });
    res.json(board);
  },

  async create(req: Request, res: Response) {
    const { title } = req.body;
    const board = await Board.create({ title });
    res.status(201).json(board);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const result = await sequelize.transaction(async (transaction) => {
      const board = await Board.findByPk(id, {
        transaction,
        rejectOnEmpty: new NotFoundError("Board not found"),
      });

      await board.update({ title: req.body.title }, { transaction });
      return board;
    });

    res.json(result.get());
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const result = await sequelize.transaction(async (transaction) => {
      const board = await Board.findByPk(id, {
        rejectOnEmpty: new NotFoundError("Board not found"),
      });
      await board.destroy({ transaction });
    });
    res.json({ message: "Board deleted" });
  },
};
