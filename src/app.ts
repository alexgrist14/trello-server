import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { BoardController } from "./controllers/board.controller";
import { ListController } from "./controllers/list.controller";
import { TaskController } from "./controllers/task.controller";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/api/boards", BoardController.getAll);
app.get("/api/boards/:id", BoardController.getOne);
app.post("/api/boards", BoardController.create);
app.patch("/api/boards/:id", BoardController.update);
app.delete("/api/boards/:id", BoardController.delete);

app.get("/api/lists/:boardId", ListController.getAll);
app.post("/api/lists/:boardId", ListController.create);
app.patch("/api/lists/:id", ListController.update);
app.delete("/api/lists/:id", ListController.delete);

app.post("/api/lists/:listId/tasks", TaskController.create);
app.patch("/api/tasks/:id", TaskController.update);
app.put("/api/tasks/:id", TaskController.reorder);
app.delete("/api/tasks/:id", TaskController.delete);

app.use(errorHandler);
export default app;
