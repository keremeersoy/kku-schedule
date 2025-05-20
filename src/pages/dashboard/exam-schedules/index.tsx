/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { Button } from "@/components/ui/button";
import { api } from "@/utils/api"; // Uncommented
import { Plus } from "lucide-react";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";
import type { ExamSchedule, Faculty, CourseExamSchedule as PrismaCourseExamSchedule, Course as PrismaCourse } from "@prisma/client"; // Added Course types
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns'; // For consistent date formatting
import { tr } from 'date-fns/locale';

// Interface for CourseExamSchedule with nested Course, as returned by the API
interface CourseExamScheduleWithCourse extends PrismaCourseExamSchedule {
  course: PrismaCourse;
}

// Updated interface based on prisma.schema and potential API response
interface ExamScheduleWithDetails extends ExamSchedule {
  faculty: Faculty;
  courses: CourseExamScheduleWithCourse[]; // Expecting courses to be included for potential display (e.g., count)
}

interface FacultyGroup { 
  faculty: Faculty;
  examSchedules: ExamScheduleWithDetails[];
}

const ExamSchedulesPage = () => {
  const { data: examSchedulesData, isLoading, error } = api.examSchedule.getExamSchedules.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <ReloadIcon className="h-14 w-14 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        <p>Sınav takvimleri yüklenirken bir hata oluştu: {error.message}</p>
      </div>
    );
  }
  
  // Ensure examSchedulesData is treated as ExamScheduleWithDetails[] for type safety
  const examSchedules: ExamScheduleWithDetails[] = examSchedulesData as ExamScheduleWithDetails[] || [];

  const schedulesByFaculty: Record<string, FacultyGroup> = examSchedules.reduce<Record<string, FacultyGroup>>((acc, schedule) => {
    // Ensure schedule and schedule.faculty are defined before accessing id
    if (schedule && schedule.faculty) {
        const facultyId = schedule.faculty.id;
        if (!acc[facultyId]) {
        acc[facultyId] = {
            faculty: schedule.faculty,
            examSchedules: [], 
        };
        }
        acc[facultyId]?.examSchedules?.push(schedule);
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sınav Takvimleri</h1>
          <p className="text-muted-foreground">
            Tüm sınav takvimlerinin listesi ve detayları
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/exam-schedules/create">
            <Plus className="mr-2 h-4 w-4" />
            Sınav Takvimi Oluştur
          </Link>
        </Button>
      </div>

      {Object.keys(schedulesByFaculty).length === 0 && !isLoading ? (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3 className="text-lg font-medium">Sınav Takvimi bulunamadı</h3>
            <p className="text-sm text-muted-foreground">
              Başlamak için ilk sınav takviminizi oluşturun.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.values(schedulesByFaculty).map((group: FacultyGroup) => (
            <div key={group.faculty.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h2 className="text-2xl font-semibold tracking-tight mb-4 text-primary">{group.faculty.name}</h2> 
              {group.examSchedules.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium text-muted-foreground w-[300px]">Takvim Başlığı</TableHead>
                      <TableHead className="font-medium text-muted-foreground">Ders Sayısı</TableHead>
                      <TableHead className="font-medium text-muted-foreground">Başlangıç Tarihi</TableHead>
                      <TableHead className="font-medium text-muted-foreground">Bitiş Tarihi</TableHead>
                      <TableHead className="font-medium text-muted-foreground text-right">Oluşturulma Tarihi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.examSchedules.map((schedule) => (
                      <TableRow key={schedule.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="py-3 font-medium">
                          <Link href={`/dashboard/exam-schedules/${schedule.id}`} className="hover:underline">
                            {schedule.title}
                          </Link>
                        </TableCell>
                        <TableCell className="py-3">
                          {schedule.courses?.length ?? 0}
                        </TableCell>
                        <TableCell className="py-3">
                          {format(new Date(schedule.start_date), "PPP", { locale: tr })}
                        </TableCell>
                        <TableCell className="py-3">
                          {format(new Date(schedule.end_date), "PPP", { locale: tr })}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          {format(new Date(schedule.created_at), "PPP", { locale: tr })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground py-3">
                  Bu fakülteye ait sınav takvimi bulunmamaktadır. 
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamSchedulesPage; 