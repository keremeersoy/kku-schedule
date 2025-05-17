import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFacultySchema, type CreateFacultySchema } from "@/schemas/faculty";
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


const CreateDepartmentPage = () => {
  const router = useRouter();

  const createForm = useForm<CreateFacultySchema>({
    resolver: zodResolver(createFacultySchema),
    defaultValues: {
      name: "",
    },
  });

  const createFacultyMutation = api.faculty.createFaculty.useMutation();

  const handleCreateFaculty = async (data: CreateFacultySchema) => {
    const result = await createFacultyMutation.mutateAsync(data);

    if (result) {
      toast({
        title: "Başarıyla fakülte oluşturdunuz.",
        description: "Fakülteler sayfasından fakültelere erişebilirsiniz.",
        variant: "success",
      });
      void router.push("/dashboard/faculties");
    } else {
      toast({
        title: "Bir hata oluştu.",
        description: "Lütfen daha sonra tekrar deneyiniz.",
        variant: "destructive",
      });
    }
  };

  return (
    <MaxWidthWrapper>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Fakülte Oluştur</CardTitle>
        </CardHeader>

        <Form {...createForm}>
          <form onSubmit={createForm.handleSubmit(handleCreateFaculty)}>
            <CardContent className="flex flex-col space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fakülte Adı</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        id="name"
                        type="text"
                        placeholder="Mühendislik Fakültesi"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="success"
                type="submit"
              >
                Fakülte Oluştur
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </MaxWidthWrapper>
  );
};

export default CreateDepartmentPage;
