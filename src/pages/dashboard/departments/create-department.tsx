import { Button } from "@/components/ui/button";
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
import { type Faculty } from "@/types";

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

  const createDepartmentMutation = api.department.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Bölüm başarıyla oluşturuldu",
        description: "Bölümler sayfasına yönlendiriliyorsunuz",
        variant: "success",
      });
      void router.push("/dashboard/departments");
    },
    onError: (error) => {
      toast({
        title: "Bir hata oluştu",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateDepartment = async (data: CreateDepartmentSchema) => {
    await createDepartmentMutation.mutateAsync(data);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Bölüm Oluştur</h1>
        <p className="text-muted-foreground">
          Fakülteye yeni bir bölüm ekleyin
        </p>
      </div>

      <Form {...createForm}>
        <form onSubmit={createForm.handleSubmit(handleCreateDepartment)} className="space-y-6">
          <FormField
            control={createForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bölüm Adı</FormLabel>
                <FormControl>
                  <Input placeholder="Bölüm adını giriniz" {...field} />
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
                <FormLabel>Fakülte</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Fakülte seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {faculties?.map((faculty: Faculty) => (
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

          <Button
            type="submit"
            disabled={createDepartmentMutation.isLoading}
          >
            {createDepartmentMutation.isLoading ? "Oluşturuluyor..." : "Oluştur"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateDepartmentPage;
