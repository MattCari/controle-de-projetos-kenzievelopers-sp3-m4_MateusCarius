import { Request, Response } from "express";
import format from "pg-format";
import {
  IProject,
  Itechnologies,
  devInfoRequest,
  devInfoResult,
  developerResult,
  projectRequest,
} from "./interfaces";
import { developerRequest } from "./interfaces";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";

const createDev = async (req: Request, res: Response): Promise<Response> => {
  const devData: developerRequest = req.body;
  const devQuery = format(
    `
        INSERT INTO developers(%I)
        VALUES(%L)
        RETURNING *;
    `,
    Object.keys(devData),
    Object.values(devData)
  );
  const devQueryResult: developerResult = await client.query(devQuery);

  const createdDev = devQueryResult.rows[0];

  return res.status(201).json(createdDev);
};

const getDev = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const queryString = format(
    `
        SELECT * FROM developers d
        JOIN developer_infos di on di."developerId" = d.id 
        WHERE d.id = %L   
    `,
    id
  );
  const queryResult: developerResult = await client.query(queryString);

  const selectedDev = queryResult.rows[0];
  return res.status(200).json(selectedDev);
};

const updateDev = async (req: Request, res: Response): Promise<Response> => {
  const data = req.body;
  const { id } = req.params;
  const queryString = format(
    `
        UPDATE developers
        SET(%I) = ROW(%L)
        WHERE id = %L
        RETURNING *;
    `,
    Object.keys(data),
    Object.values(data),
    id
  );
  const queryResult: developerResult = await client.query(queryString);
  const updatedDev = queryResult.rows[0];
  return res.status(200).json(updatedDev);
};

const deleteDev = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const queryString = format(
    `
        DELETE FROM developers
        WHERE id = %L
    `,
    id
  );
  await client.query(queryString);
  return res.status(204).json();
};

const addDevInfo = async (req: Request, res: Response): Promise<Response> => {
  const data: devInfoRequest = req.body;
  const { id } = req.params;

  const queryString = format(
    `
    INSERT INTO developer_infos (%I, "developerId")
    VALUES (%L, %L)
    RETURNING *;
 `,
    Object.keys(data),
    Object.values(data),
    id
  );

  const queryResult: devInfoResult = await client.query(queryString);
  const devInfo = queryResult.rows[0];

  return res.status(201).json(devInfo);
};

const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data: IProject = req.body;

  const queryString = format(
    `
        INSERT INTO projects(%I)
        VALUES(%L)
        RETURNING *;
    `,
    Object.keys(data),
    Object.values(data)
  );

  const queryResult = await client.query(queryString);
  const newProject = queryResult.rows[0];

  return res.status(201).json(newProject);
};

const getProject = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const queryString = format(
    `
    SELECT 
    p.id "projectId",
    p.name "projectName",
    p.description "projectDescription",
    p."estimatedTime" "projectEstimatedTime",
    p.repository "projectRepository",
    p."startDate" "projectStartDate",
    p."endDate" "projectEndDate",
    p."developerId" "projectDeveloperId",
    pt."addedIn" "technologyAddedIn",
    t.name "technologyName"
    FROM projects_technologies pt
    JOIN projects p ON pt."projectId" = p.id
    JOIN technologies t ON pt."technologyId" = t.id
    WHERE pt."projectId" = %L;
  `,
    id
  );

  const queryResult = await client.query(queryString);
  const project = queryResult.rows;
  return res.status(200).json(project);
};

const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const data: projectRequest = req.body;

  const queryString = format(
    `
    UPDATE projects
    SET (%I) = ROW(%L)
    WHERE id = %L
    RETURNING *;
  `,
    Object.keys(data),
    Object.values(data),
    id
  );

  const queryResult: QueryResult = await client.query(queryString)
  const newInfo = queryResult.rows[0]
  return res.status(200).json(newInfo);
};

const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  const queryString = format(
    `
      DELETE FROM projects
      WHERE "id" = (%L)  
  `,
    id
  );

  await client.query(queryString);
  return res.status(204).json();
};

const createProjectTech = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data: Itechnologies = req.body;
  const { id } = req.params;

  const techIdQuery = `
   SELECT id FROM technologies t
   WHERE t.name = $1; 
 `;
  const queryConfig: QueryConfig = {
    text: techIdQuery,
    values: [data.name],
  };
  const techIdQueryResult = await client.query(queryConfig);
  const techId = techIdQueryResult.rows[0].id;

  const payload = {
    projectId: id,
    technologyId: techId,
    addedIn: new Date(),
  };

  const queryString = format(
    `
    INSERT INTO projects_technologies(%I)
    VALUES(%L)
    RETURNING *;
  `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult = await client.query(queryString);
  const newTech = queryResult.rows[0];

  return res.status(201).json(newTech);
};

const deleteProjectTech = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id, name } = req.params;

  const techIdQuery = format(
    `
   SELECT id FROM technologies t
   WHERE t.name = %L; 
 `,
    name
  );
  const queryResult = await client.query(techIdQuery);
  const techId = queryResult.rows[0].id;

  const queryString = format(
    `
  DELETE FROM projects_technologies
  WHERE ("projectId","technologyId") = (%L,%L);
  `,
    id,
    techId
  );
  await client.query(queryString);

  return res.status(204).json();
};

export {
  createDev,
  getDev,
  addDevInfo,
  updateDev,
  deleteDev,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  createProjectTech,
  deleteProjectTech,
};
