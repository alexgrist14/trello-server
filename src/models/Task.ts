import {
  Model,
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
} from "sequelize-typescript";
import List from "./List";

@Table({ tableName: "Tasks", modelName: "Tasks" })
export default class Task extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({ type: DataType.INTEGER })
  taskOrder!: number;

  @ForeignKey(() => List)
  @Column({ type: DataType.INTEGER })
  listId!: number;

  @BelongsTo(() => List)
  list!: List;
}
