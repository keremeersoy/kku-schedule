import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
import type { Classroom, Faculty } from "@prisma/client";

interface ClassroomWithFaculty extends Classroom {
  faculty: Faculty;
}

interface FacultyGroup {
  faculty: Faculty;
  classrooms: ClassroomWithFaculty[];
}

export const classroomRouter = createTRPCRouter({
  getAllClassrooms: protectedProcedure.query(async () => {
    const classrooms = await db.classroom.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        examRooms: true,
        examSchedules: true,
        faculty: true,
      },
    });

    return classrooms;
  }),

  getClassroomsByFaculty: protectedProcedure.query(async () => {
    const classrooms = await db.classroom.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        faculty: true,
        examRooms: true,
        examSchedules: true,
      },
    }) as ClassroomWithFaculty[];

    const groupedClassrooms = classrooms.reduce<Record<string, FacultyGroup>>((acc, classroom) => {
      const facultyId = classroom.faculty.id;
      if (!acc[facultyId]) {
        acc[facultyId] = {
          faculty: classroom.faculty,
          classrooms: [],
        };
      }
      acc[facultyId]?.classrooms?.push(classroom);
      return acc;
    }, {});

    return Object.values(groupedClassrooms);
  }),

  getClassroomById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const classroom = await db.classroom.findUnique({
        where: { id: input.id },
        include: {
          examRooms: true,
          examSchedules: true,
          faculty: true,
        },
      });

      return classroom;
    }),

  createClassroom: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        capacity: z.number().min(1, { message: "Capacity must be at least 1" }),
        facultyId: z.string().min(1, { message: "Faculty is required" }),
      })
    )
    .mutation(async ({ input }) => {
      const classroom = await db.classroom.create({
        data: {
          name: input.name,
          capacity: input.capacity,
          facultyId: input.facultyId,
        },
        include: {
          faculty: true,
        },
      });

      return classroom;
    }),

  updateClassroom: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, { message: "Name is required" }),
        capacity: z.number().min(1, { message: "Capacity must be at least 1" }),
        facultyId: z.string().min(1, { message: "Faculty is required" }),
      })
    )
    .mutation(async ({ input }) => {
      const classroom = await db.classroom.update({
        where: { id: input.id },
        data: {
          name: input.name,
          capacity: input.capacity,
          facultyId: input.facultyId,
        },
        include: {
          faculty: true,
        },
      });

      return classroom;
    }),

  deleteClassroom: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.classroom.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});