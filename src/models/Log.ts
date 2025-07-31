import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({ tableName: "Logs", modelName: "Logs" })
export default class Log extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  entity!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  entityId!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  action!: "create" | "update" | "delete";

  @Column({ type: DataType.INTEGER, allowNull: false })
  boardId!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
