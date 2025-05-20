import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
// Import your Zod schema for exam schedule creation (assuming it will be in @/schemas/examSchedule)
// For now, let's define a basic one inline or use the one from the frontend for structure

const courseExamDetailSchemaForRouter = z.object({
  courseId: z.string(),
  exam_duration: z.coerce.number().int().min(30),
  student_count: z.coerce.number().int().min(0).default(0),
  // student_count: z.coerce.number().int().min(0).optional(),
});

const createExamScheduleSchemaForRouter = z.object({
  title: z.string().min(1),
  facultyId: z.string().min(1),
  start_date: z.date(),
  end_date: z.date(),
  assistant_count: z.coerce.number().int().min(0),
  max_classes_per_assistant: z.coerce.number().int().min(1),
  courseExams: z.array(courseExamDetailSchemaForRouter).min(1),
  selectedClassroomIds: z.array(z.string()).min(1, "En az bir derslik seçilmelidir."),
}).refine((data) => data.end_date > data.start_date, {
  message: "Bitiş tarihi başlangıç tarihinden sonra olmalıdır.",
  path: ["end_date"], 
});

export const examScheduleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createExamScheduleSchemaForRouter) // Use the defined Zod schema
    .mutation(async ({ ctx, input }) => {
      const { facultyId, title, start_date, end_date, assistant_count, max_classes_per_assistant, courseExams, selectedClassroomIds } = input;

      const newExamSchedule = await ctx.db.$transaction(async (prisma) => {
        const schedule = await prisma.examSchedule.create({
          data: {
            title,
            facultyId,
            start_date,
            end_date,
            assistant_count,
            max_classes_per_assistant,
          },
        });

        if (courseExams && courseExams.length > 0) {
          await prisma.courseExamSchedule.createMany({
            data: courseExams.map(ce => ({
              examScheduleId: schedule.id,
              courseId: ce.courseId,
              exam_duration: ce.exam_duration,
              student_count: ce.student_count,
            })),
          });
        }

        // Create ExamScheduleClassroom entries
        if (selectedClassroomIds && selectedClassroomIds.length > 0) {
          await prisma.examScheduleClassroom.createMany({
            data: selectedClassroomIds.map(classroomId => ({
              examScheduleId: schedule.id,
              classroomId: classroomId,
            })),
          });
        }

        return schedule; // Return the created schedule object
      });
      return newExamSchedule;
    }),

  getExamSchedules: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.examSchedule.findMany({
      include: {
        faculty: true,
        courses: { 
          include: {
            course: true, 
          }
        }
        // TODO: Include other relations like classrooms if needed for the listing page
      },
      orderBy: {
        created_at: "desc",
      }
    });
  }),

  getScheduleById: protectedProcedure
    .input(z.object({ scheduleId: z.string() }))
    .query(async ({ ctx, input }) => {
      const schedule = await ctx.db.examSchedule.findUnique({
        where: { id: input.scheduleId },
        include: {
          faculty: true,
          courses: {
            include: {
              course: true, // Include details of the course itself
            },
            orderBy: {
              course: {
                name: "asc", // Order courses by name
              }
            }
          },
          classrooms: { // Assuming you might want to show linked classrooms
            include: {
              classroom: true, // Include details of the classroom
            }
          }
          // examGroups can also be included if needed later
        },
      });
      if (!schedule) {
        // Optionally, throw a TRPCError.NotFound or return null and handle on client
        // For now, returning null, client should check
        return null;
      }
      return schedule;
    }),
}); 