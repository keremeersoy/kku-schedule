import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import type { Department, Faculty } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <div className="flex h-[50vh] items-center justify-center">
        <ReloadIcon className="h-14 w-14 animate-spin" />
      </div>
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bölümler</h1>
          <p className="text-muted-foreground">
            Tüm bölümlerin listesi ve detayları
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/departments/create-department">
            <Plus className="mr-2 h-4 w-4" />
            Bölüm Oluştur
          </Link>
        </Button>
      </div>

      {!departments?.length ? (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3 className="text-lg font-medium">Bölüm bulunamadı</h3>
            <p className="text-sm text-muted-foreground">
              Başlamak için ilk bölümünüzü oluşturun.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.values(departmentsByFaculty ?? {}).map((group: FacultyGroup) => (
            <div key={group.faculty.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h2 className="text-2xl font-semibold tracking-tight mb-4 text-primary">{group.faculty.name}</h2>
              {group.departments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium text-muted-foreground w-[400px]">Bölüm Adı</TableHead>
                      <TableHead className="font-medium text-muted-foreground text-right">Oluşturulma Tarihi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.departments.map((department) => (
                      <TableRow key={department.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="py-3 font-medium">
                          {/* TODO: Add link to department details if exists /dashboard/departments/${department.id} ? */}
                          {department.name}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          {new Date(
                            department.createdAt as Date
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground py-3">
                  Bu fakülteye ait bölüm bulunmamaktadır.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;
