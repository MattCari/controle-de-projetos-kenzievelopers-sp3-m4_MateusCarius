import express, { Application } from "express";
import "dotenv/config";
import {
  addDevInfo,
  createDev,
  createProject,
  createProjectTech,
  deleteDev,
  deleteProject,
  deleteProjectTech,
  getDev,
  getProject,
  updateDev,
  updateProject,
} from "./logic";
import {
  devEmailAlreadyExists,
  ensureDevIdExists,
  ensureProjectIdExists,
  ensureTechIdExists,
  osNotRegistered,
} from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/developers", devEmailAlreadyExists, createDev);
app.post(
  "/developers/:id/infos",
  ensureDevIdExists,
  osNotRegistered,
  addDevInfo
);
app.get("/developers/:id", ensureDevIdExists, getDev);
app.patch(
  "/developers/:id",
  ensureDevIdExists,
  devEmailAlreadyExists,
  updateDev
);
app.delete("/developers/:id", ensureDevIdExists, deleteDev);

app.post("/projects", createProject);
app.post("/projects/:id/technologies",ensureProjectIdExists,ensureTechIdExists, createProjectTech);
app.get("/projects/:id", getProject);
app.patch("/projects/:id", updateProject);
app.delete("/projects/:id", deleteProject);
app.delete("/projects/:id/technologies/:name", deleteProjectTech);

export default app;
