import Log from "../models/Log";

export async function logAction(
  entity: "List" | "Task",
  entityId: number,
  action: "create" | "update" | "delete",
  boardId: number,
  title: string
) {
  await Log.create({
    entity,
    entityId,
    action,
    boardId,
    title,
  });
}
