import React from 'react'
import { api } from "@/utils/api";
import MaxWidthWrapperWithoutFlex from "../max-width-wrapper-without-flex";
import { ReloadIcon } from "@radix-ui/react-icons";

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
          {data?.map((faculty) => (
            <div>{faculty.name}</div>
          ))}
        </div>
      );
}

export default AllFacultiesArea
