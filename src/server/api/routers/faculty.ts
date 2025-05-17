import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";

export const facultyRouter = createTRPCRouter({
    getAllFaculties: protectedProcedure.query(async () => {
      const faculties = await db.faculty.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: true
        },
      });

      return faculties;
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
            userId,
            name: input.name,
          },
        });

        return faculty;
      }),
  });