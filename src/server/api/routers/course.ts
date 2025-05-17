import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createCourseSchema } from "@/schemas/course";

export const courseRouter = createTRPCRouter({
  getCourses: protectedProcedure.query(async ({ ctx }) => {
    const courses = await ctx.db.course.findMany({
      include: {
        department: {
          include: {
            faculty: true,
          },
        },
      }
    });

    return courses;
  }),

  getCoursesByDepartment: protectedProcedure
    .input(z.object({ departmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const courses = await ctx.db.course.findMany({
        where: {
          departmentId: input.departmentId,
        },
        include: {
          department: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return courses;
    }),

  create: protectedProcedure
    .input(createCourseSchema)
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.db.course.create({
        data: {
          name: input.name,
          code: input.code,
          credit: input.credit,
          departmentId: input.departmentId,
        },
        include: {
          department: true,
        },
      });

      return course;
    })
});