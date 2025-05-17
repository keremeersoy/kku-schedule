import * as z from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  facultyId: z.string().min(1, { message: "Faculty is required" }),
});

export type CreateDepartmentSchema = z.infer<typeof createDepartmentSchema>;

export const departmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  facultyId: z.string(),
  createdAt: z.date(),
});

export type Department = z.infer<typeof departmentSchema>;