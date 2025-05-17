import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { facultyRouter } from "./routers/faculty";
import { departmentRouter } from "./routers/department";
import { courseRouter } from "./routers/course";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  faculty: facultyRouter,
  department: departmentRouter,
  course: courseRouter
});

export type AppRouter = typeof appRouter;
