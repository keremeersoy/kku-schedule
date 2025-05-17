import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

type AllFaculties = RouterOutput["faculty"]["getAllFaculties"];
type AllDepartments = RouterOutput["department"]["getDepartments"];
type AllCourses = RouterOutput["course"]["getCourses"];

export type Faculty = AllFaculties[number];
export type Department = AllDepartments[number];
export type Course = AllCourses[number];