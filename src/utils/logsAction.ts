import Log from "../models/Log";

export async function logAction(
  entity: "List" | "Task",
  entityId: number,
  action: "create" | "update" | "delete"
) {
  await Log.create({
    entity,
    entityId,
    action,
  });
}
