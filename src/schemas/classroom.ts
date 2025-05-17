import * as z from "zod";

export const createClassroomSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  capacity: z.number().min(1, { message: "Capacity must be at least 1" }),
  facultyId: z.string().min(1, { message: "Faculty is required" })
});

export type CreateClassroomSchema = z.infer<typeof createClassroomSchema>;