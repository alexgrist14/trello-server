import { Sequelize } from "sequelize-typescript";
import Board from "../models/Board";
import List from "../models/List";
import Task from "../models/Task";
import "dotenv/config";
import Log from "../models/Log";

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    dialect: "postgres",
    logging: false,
    models: [Board, List, Task, Log],
  }
);

export default sequelize;
