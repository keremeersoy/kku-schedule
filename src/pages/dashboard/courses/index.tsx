import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import type { Course } from "@/types";

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
      <div className="flex items-center justify-between">
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
        <div className="space-y-8">
          {Object.values(coursesByFacultyAndDepartment ?? {}).map((group: FacultyGroup) => (
            <div key={group.faculty.name} className="space-y-4">
              <h2 className="text-xl font-semibold">{group.faculty.name}</h2>
              {group.departments.map((department) => (
                <div key={department.name} className="space-y-4">
                  <h3 className="text-lg font-medium">{department.name}</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {department.courses.map((course) => (
                      <Card key={course.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{course.name}</h4>
                              <span className="text-sm font-medium text-muted-foreground">
                                {course.code}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>Kredi: {course.credit}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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