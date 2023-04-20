import { NextFunction, Request, Response } from "express";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { Itechnologies } from "./interfaces";

const ensureDevIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { id } = req.params;

  const queryString = format(
    `
        SELECT * FROM developers
        WHERE id = %L;
    `,
    id
  );

  const queryResult: QueryResult = await client.query(queryString);

  if (queryResult.rowCount == 0) {
    res.status(404).json({ message: "developer not found" });
  } else {
    return next();
  }
};

const devEmailAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data = req.body;
  const queryString = `
        SELECT * FROM developers
        WHERE email = $1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [data.email],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    res.status(409).json({ message: "email already registered" });
  } else {
    return next();
  }
};

const osNotRegistered = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const data = req.body;

  if (data.preferredOS != "Windows" || "Linux" || "MacOS") {
    res.status(409).json({
      message: "OS not found",
    });
  } else {
    return next();
  }
};

const ensureProjectIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { id } = req.params;

  const queryString = format(
    `
        SELECT * FROM projects
        WHERE id = %L
    `,
    id
  );
  const queryResult = await client.query(queryString);
  if (queryResult.rowCount == 0) {
    res.status(404).json({
      message: "project not found",
    });
  } else {
    return next();
  }
};

const ensureTechIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data: Itechnologies = req.body;

  const techIdQuery = `
   SELECT id FROM technologies t
   WHERE t.name = $1; 
 `;
  const queryConfig: QueryConfig = {
    text: techIdQuery,
    values: [data.name],
  };

  const techIdQueryResult = await client.query(queryConfig);
  const techId = techIdQueryResult.rows[0];

  const queryString = format(
    `
    SELECT FROM technologies
    WHERE id = %L  ;
`,
    techId
  );
  const queryResult: QueryResult = await client.query(queryString);

  if (queryResult.rowCount == 0) {
    res.status(404).json({
      message: "technology not found",
    });
  } else {
    return next();
  }
};
const techNameNotExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
    const data:Itechnologies = req.body

    const queryString = (`
        SELECT * FROM projects
        WHERE 
    `)
  await client;
  return next();
};

export { ensureDevIdExists, devEmailAlreadyExists, osNotRegistered,ensureTechIdExists, ensureProjectIdExists };
