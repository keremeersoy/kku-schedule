import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Bölüm adı zorunludur'),
  facultyId: z.string().min(1, 'Fakülte seçimi zorunludur'),
});

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

  create: protectedProcedure
    .input(createDepartmentSchema)
    .mutation(async ({ ctx, input }) => {
      const department = await ctx.db.department.create({
        data: {
          name: input.name,
          facultyId: input.facultyId,
        },
        include: {
          faculty: true,
        },
      });

      return department;
    }),
});