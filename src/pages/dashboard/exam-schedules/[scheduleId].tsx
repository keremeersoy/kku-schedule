/* eslint-disable @typescript-eslint/no-empty-interface */

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Users, BookOpen, Tag, Hash, Clock, School as SchoolIcon, Building } from "lucide-react";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { ExamSchedule as PrismaExamSchedule, Faculty, CourseExamSchedule as PrismaCourseExamSchedule, Course as PrismaCourse, ExamScheduleClassroom as PrismaExamScheduleClassroom, Classroom as PrismaClassroom } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

// Interfaces for detailed data structures
interface CourseWithDetails extends PrismaCourse {}
interface CourseExamScheduleWithCourse extends PrismaCourseExamSchedule {
  course: CourseWithDetails;
}
interface ExamScheduleClassroomWithClassroom extends PrismaExamScheduleClassroom {
  classroom: PrismaClassroom;
}
interface ExamScheduleDetails extends PrismaExamSchedule {
  faculty: Faculty;
  courses: CourseExamScheduleWithCourse[];
  classrooms: ExamScheduleClassroomWithClassroom[];
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | number | null }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <Icon className="h-5 w-5 text-muted-foreground" />
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-primary">{value ?? "-"}</p>
    </div>
  </div>
);

const ExamScheduleDetailPage = () => {
  const router = useRouter();
  const { scheduleId } = router.query;

  const { data: schedule, isLoading, error } = api.examSchedule.getScheduleById.useQuery(
    { scheduleId: scheduleId as string },
    { enabled: !!scheduleId } // Only run query if scheduleId is available
  );

  if (isLoading || !scheduleId) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <ReloadIcon className="h-14 w-14 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center text-red-500">
        <p>Sınav takvimi yüklenirken bir hata oluştu: {error.message}</p>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-xl text-muted-foreground">Sınav Takvimi Bulunamadı.</p>
      </div>
    );
  }
  // Cast to ensure type safety after check
  const typedSchedule = schedule as ExamScheduleDetails;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
                <CardTitle className="text-3xl font-bold tracking-tight flex items-center">
                    <CalendarDays className="mr-3 h-8 w-8 text-primary" /> 
                    {typedSchedule.title}
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                    {typedSchedule.faculty.name}
                </CardDescription>
            </div>
            {/* TODO: Add Edit/Delete buttons here if needed */}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <DetailItem icon={CalendarDays} label="Başlangıç Tarihi" value={format(new Date(typedSchedule.start_date), "PPP", { locale: tr })} />
            <DetailItem icon={CalendarDays} label="Bitiş Tarihi" value={format(new Date(typedSchedule.end_date), "PPP", { locale: tr })} />
            <DetailItem icon={Users} label="Asistan Sayısı" value={typedSchedule.assistant_count} />
            <DetailItem icon={BookOpen} label="Asistan Başına Maks. Ders" value={typedSchedule.max_classes_per_assistant} />
          </div>

          {/* Courses Table */}
          {typedSchedule.courses && typedSchedule.courses.length > 0 && (
            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-3">Takvime Dahil Edilen Dersler ({typedSchedule.courses.length})</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ders Kodu</TableHead>
                    <TableHead>Ders Adı</TableHead>
                    <TableHead className="text-right">Sınav Süresi (dk)</TableHead>
                    <TableHead className="text-right">Öğrenci Sayısı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typedSchedule.courses.map(({ course, exam_duration, student_count }) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell className="text-right">{exam_duration} dk</TableCell>
                      <TableCell className="text-right">{student_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Classrooms Table */}
          {typedSchedule.classrooms && typedSchedule.classrooms.length > 0 && (
            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-3">Takvim İçin Atanan Sınıflar ({typedSchedule.classrooms.length})</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sınıf Adı</TableHead>
                    <TableHead className="text-right">Kapasite</TableHead>
                    <TableHead className="text-right">Belirlenen Kapasite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typedSchedule.classrooms.map(({ classroom, overriddenCapacity }) => (
                    <TableRow key={classroom.id}>
                      <TableCell>{classroom.name}</TableCell>
                      <TableCell className="text-right">{classroom.capacity}</TableCell>
                      <TableCell className="text-right">{overriddenCapacity ?? classroom.capacity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default ExamScheduleDetailPage; 