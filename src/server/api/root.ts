import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { facultyRouter } from "./routers/faculty";
import { departmentRouter } from "./routers/department";
import { courseRouter } from "./routers/course";
import { classroomRouter } from "./routers/classroom";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  faculty: facultyRouter,
  department: departmentRouter,
  course: courseRouter,
  classroom: classroomRouter
});

export type AppRouter = typeof appRouter;
