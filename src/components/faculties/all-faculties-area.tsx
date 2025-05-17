import React from 'react'
import { api } from "@/utils/api";
import MaxWidthWrapperWithoutFlex from "../max-width-wrapper-without-flex";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import { type Faculty } from '@/types';

const AllFacultiesArea = () => {
      const { data, isLoading, error } = api.faculty.getAllFaculties.useQuery();

      if (isLoading)
        return (
          <MaxWidthWrapperWithoutFlex className="flex items-center justify-center">
            <ReloadIcon className="w-1h-14 h-14 animate-spin" />
          </MaxWidthWrapperWithoutFlex>
        );

      if (error)
        return (
          <div>
            {void console.log("error", error)}
            error
          </div>
        );

      return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((faculty: Faculty) => (
            <Link href={`/dashboard/faculties/${faculty.id}`} key={faculty.id}>
              <Card className="transition-all hover:scale-105 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{faculty.name}</CardTitle>
                  <CardDescription>Fakülte Detaylarını Görüntüle</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Bölüm Sayısı: {faculty.departments?.length || 0}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      );
}

export default AllFacultiesArea
