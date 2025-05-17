import React from 'react'
import { api } from "@/utils/api";
import MaxWidthWrapperWithoutFlex from "../max-width-wrapper-without-flex";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from 'next/link';
import { type Faculty } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AllFacultiesArea = () => {
      const { data: faculties, isLoading, error } = api.faculty.getAllFaculties.useQuery();

      if (isLoading)
        return (
          <MaxWidthWrapperWithoutFlex className="flex h-[50vh] items-center justify-center">
            <ReloadIcon className="h-14 w-14 animate-spin" />
          </MaxWidthWrapperWithoutFlex>
        );

      if (error) {
        console.error("Error fetching faculties:", error);
        return (
          <div className="p-6 text-red-600">
            Fakülte verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </div>
        );
      }

      if (!faculties || faculties.length === 0) {
        return (
          <div className="p-6 text-center text-muted-foreground">
            <p className="text-lg font-semibold">Fakülte Bulunamadı</p>
            <p>Sistemde kayıtlı fakülte bulunmamaktadır.</p>
          </div>
        );
      }

      return (
        <div className="space-y-10 p-1 md:p-4 lg:p-6">
          {faculties.map((faculty: Faculty) => (
            <div key={faculty.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <Link href={`/dashboard/faculties/${faculty.id}`} className="hover:underline">
                 <h2 className="text-2xl font-semibold tracking-tight mb-4 text-primary">{faculty.name}</h2>
              </Link>

              {faculty.departments && faculty.departments.length > 0 ? (
                <Table>
                  {/* <TableCaption className="text-sm text-muted-foreground mt-2 mb-1">
                    {faculty.name} fakültesine ait bölümler
                  </TableCaption> */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium text-muted-foreground">Bölüm Adı</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faculty.departments.map((department) => (
                      <TableRow key={department.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="py-3">
                          {department.name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground py-3">
                  Bu fakültede henüz bölüm bulunmamaktadır.
                </p>
              )}
            </div>
          ))}
        </div>
      );
}

export default AllFacultiesArea
