import { z } from "zod";

export const createCourseSchema = z.object({
  name: z.string().min(1, 'Ders adı zorunludur'),
  code: z.string().min(1, 'Ders kodu zorunludur'),
  credit: z.number().min(1, 'Kredi sayısı zorunludur'),
  departmentId: z.string().min(1, 'Bölüm seçimi zorunludur'),
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;
