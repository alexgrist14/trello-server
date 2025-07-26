import {
  Model,
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import Board from "./Board";
import Task from "./Task";

@Table({ tableName: "Lists", modelName: "Lists" })
export default class List extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @ForeignKey(() => Board)
  @Column({ type: DataType.INTEGER })
  boardId!: number;

  @BelongsTo(() => Board)
  board!: Board;

  @HasMany(() => Task)
  tasks!: Task[];
}
