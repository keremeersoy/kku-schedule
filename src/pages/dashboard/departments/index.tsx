import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import type { Department, Faculty } from "@prisma/client";

interface DepartmentWithFaculty extends Department {
  faculty: Faculty;
}

interface FacultyGroup {
  faculty: Faculty;
  departments: DepartmentWithFaculty[];
}

const DepartmentsPage = () => {
  const { data: departments, isLoading } = api.department.getDepartments.useQuery();

  if (isLoading) {
    return (
      <MaxWidthWrapper className="flex h-[50vh] items-center justify-center">
        <ReloadIcon className="h-14 w-14 animate-spin" />
      </MaxWidthWrapper>
    );
  }

  const departmentsByFaculty = departments?.reduce<Record<string, FacultyGroup>>((acc, department: DepartmentWithFaculty) => {
    const facultyId = department.faculty.id;
    if (!acc[facultyId]) {
      acc[facultyId] = {
        faculty: department.faculty,
        departments: [],
      };
    }
    acc[facultyId].departments.push(department);
    return acc;
  }, {});

  return (
    <MaxWidthWrapper className="space-y-8 w-full">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your departments and their details
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/departments/create-department">
            <Plus className="mr-2 h-4 w-4" />
            Create Department
          </Link>
        </Button>
      </div>

      {!departments?.length ? (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3 className="text-lg font-medium">No departments found</h3>
            <p className="text-sm text-muted-foreground">
              Create your first department to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 w-full">
          {Object.values(departmentsByFaculty ?? {}).map((group: FacultyGroup) => (
            <div key={group.faculty.id} className="space-y-4">
              <h2 className="text-2xl font-semibold">{group.faculty.name}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.departments.map((department) => (
                  <Card key={department.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-2">
                        <h3 className="font-semibold">{department.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Created:</span>
                          <span>{new Date(department.createdAt as Date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default DepartmentsPage;
