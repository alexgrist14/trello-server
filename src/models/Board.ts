import { Model, Column, Table, DataType, HasMany } from "sequelize-typescript";
import List from "./List";

@Table({ tableName: "Boards", modelName: "Boards" })
export default class Board extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @HasMany(() => List)
  lists!: List[];
}
