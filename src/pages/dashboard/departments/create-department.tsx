import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createDepartmentSchema, type CreateDepartmentSchema } from "@/schemas/department";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Faculty } from "@prisma/client";

const CreateDepartmentPage = () => {
  const router = useRouter();
  const { data: faculties } = api.faculty.getAllFaculties.useQuery();

  const createForm = useForm<CreateDepartmentSchema>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: "",
      facultyId: "",
    },
  });

  const createDepartmentMutation = api.department.createDepartment.useMutation();

  const handleCreateDepartment = async (data: CreateDepartmentSchema) => {
    const result = await createDepartmentMutation.mutateAsync(data);

    if (result) {
      toast({
        title: "Successfully created department.",
        description: "You can access departments from the departments page.",
        variant: "success",
      });
      void router.push("/dashboard/departments");
    } else {
      toast({
        title: "An error occurred.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <MaxWidthWrapper>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Department</CardTitle>
        </CardHeader>

        <Form {...createForm}>
          <form onSubmit={createForm.handleSubmit(handleCreateDepartment)}>
            <CardContent className="flex flex-col space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="name"
                        type="text"
                        placeholder="Computer Engineering"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="facultyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faculty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a faculty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {faculties?.map((faculty) => (
                          <SelectItem key={faculty.id} value={faculty.id}>
                            {faculty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="success" type="submit">
                Create Department
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </MaxWidthWrapper>
  );
};

export default CreateDepartmentPage;
