import * as z from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
//   facultyId:
});


export type CreateDepartmentSchema = z.infer<typeof createDepartmentSchema>;