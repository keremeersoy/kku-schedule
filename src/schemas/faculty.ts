import * as z from "zod";

export const createFacultySchema = z.object({
  name: z.string().min(1, { message: "Name is required" })
});


export type CreateFacultySchema = z.infer<typeof createFacultySchema>;