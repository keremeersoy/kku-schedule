import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";

export const facultyRouter = createTRPCRouter({
    getAllFaculties: protectedProcedure.query(async () => {
      const faculties = await db.faculty.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: true,
          departments: true
        },
      });

      return faculties;
    }),

    getFacultyById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const faculty = await db.faculty.findUnique({
          where: { id: input.id },
          include: {
            departments: true,
          },
        });

        return faculty;
      }),

    createFaculty: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, { message: "Name is required" }),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.session.user.id;

        const faculty = await db.faculty.create({
          data: {
            name: input.name,
            createdBy: {
              connect: {
                id: userId
              }
            }
          },
          include: {
            createdBy: true,
            departments: true
          }
        });

        return faculty;
      }),
  });