import { QueryResult } from "pg";

interface IDeveloper {
  name: string;
  email: string;
  id: number;
}

type developerRequest = Omit<IDeveloper, "id">;

type developerResult = QueryResult<IDeveloper>;

interface IDeveloperInfos {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: string | null;
}

type devInfoRequest = Omit<IDeveloperInfos, "developerId">;

type devInfoResult = QueryResult<IDeveloperInfos>;

interface devResponse extends IDeveloper, IDeveloperInfos {}

interface IProject {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date;
  developerId: number;
}

type projectRequest = Omit<IProject, "developerId">;

type projectResult = QueryResult<IProject>;

type Itechnologies = {
  name:
    | "JavaScript"
    | "Python"
    | "React"
    | "Express.js"
    | "HTML"
    | "CSS"
    | "Django"
    | "PostgreSQL"
    | "MongoDB";
};

export {
  IDeveloper,
  developerRequest,
  developerResult,
  IDeveloperInfos,
  devInfoRequest,
  devInfoResult,
  devResponse,
  IProject,
  projectRequest,
  projectResult,
  Itechnologies
};
