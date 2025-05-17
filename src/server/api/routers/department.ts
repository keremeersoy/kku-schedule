import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createDepartmentSchema } from "@/schemas/department";

export const departmentRouter = createTRPCRouter({
  getDepartments: protectedProcedure.query(async ({ ctx }) => {
    const departments = await ctx.db.department.findMany({
      include: {
        faculty: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return departments;
  }),

  createDepartment: protectedProcedure
    .input(createDepartmentSchema)
    .mutation(async ({ ctx, input }) => {
      const department = await ctx.db.department.create({
        data: {
          name: input.name,
          facultyId: input.facultyId,
        },
      });

      return department;
    }),
});