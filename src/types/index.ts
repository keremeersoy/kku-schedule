import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

type AllFaculties = RouterOutput["faculty"]["getAllFaculties"];
type AllDepartments = RouterOutput["department"]["getDepartments"];

export type Faculty = AllFaculties[number];
export type Department = AllDepartments[number];