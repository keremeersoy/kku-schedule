import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import type { Course } from "@/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SimplifiedCourse = Pick<Course, 'id' | 'name' | 'code' | 'credit'> & {
  department: {
    name: string;
    faculty: {
      name: string;
    };
  };
};

interface FacultyGroup {
  faculty: {
    name: string;
  };
  departments: {
    name: string;
    courses: SimplifiedCourse[];
  }[];
}

const CoursesPage = () => {
  const { data: courses, isLoading } = api.course.getCourses.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <ReloadIcon className="h-14 w-14 animate-spin" />
      </div>
    );
  }

  const coursesByFacultyAndDepartment = courses?.reduce<Record<string, FacultyGroup>>((acc, course) => {
    const facultyName = course.department.faculty.name;
    const departmentName = course.department.name;

    if (!acc[facultyName]) {
      acc[facultyName] = {
        faculty: {
          name: facultyName,
        },
        departments: [],
      };
    }

    let department = acc[facultyName].departments.find(d => d.name === departmentName);
    if (!department) {
      department = {
        name: departmentName,
        courses: [],
      };
      acc[facultyName].departments.push(department);
    }

    department.courses.push(course);
    return acc;
  }, {});

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dersler</h1>
          <p className="text-muted-foreground">
            Tüm derslerin listesi ve detayları
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/courses/create">
            <Plus className="mr-2 h-4 w-4" />
            Ders Oluştur
          </Link>
        </Button>
      </div>

      {!courses?.length ? (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3 className="text-lg font-medium">Ders bulunamadı</h3>
            <p className="text-sm text-muted-foreground">
              Başlamak için ilk dersinizi oluşturun.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.values(coursesByFacultyAndDepartment ?? {}).map((group: FacultyGroup) => (
            <div key={group.faculty.name} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h2 className="text-2xl font-semibold tracking-tight mb-6 text-primary">{group.faculty.name}</h2>
              {group.departments.map((department) => (
                <div key={department.name} className="mb-6 last:mb-0">
                  <h3 className="text-xl font-semibold tracking-tight mb-3 text-secondary-foreground">{department.name}</h3>
                  {department.courses.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-medium text-muted-foreground w-[300px]">Ders Adı</TableHead>
                          <TableHead className="font-medium text-muted-foreground">Ders Kodu</TableHead>
                          <TableHead className="font-medium text-muted-foreground text-right">Kredi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {department.courses.map((course) => (
                          <TableRow key={course.id} className="hover:bg-muted/50 transition-colors">
                            <TableCell className="py-3 font-medium">
                              {/* TODO: Add link to course details if exists /dashboard/courses/${course.id} ? */}
                              {course.name}
                            </TableCell>
                            <TableCell className="py-3">{course.code}</TableCell>
                            <TableCell className="py-3 text-right">
                              {course.credit}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground py-3">
                      Bu bölüme ait ders bulunmamaktadır.
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;