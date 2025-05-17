import { Button } from "@/components/ui/button";
import { createCourseSchema, type CreateCourseSchema } from "@/schemas/course";
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
import { type Department } from "@/types";

const CreateCoursePage = () => {
  const router = useRouter();
  const { data: departments } = api.department.getDepartments.useQuery();

  const createForm = useForm<CreateCourseSchema>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      name: "",
      code: "",
      credit: 0,
      departmentId: "",
    },
  });

  const createCourseMutation = api.course.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Ders başarıyla oluşturuldu",
        description: "Dersler sayfasına yönlendiriliyorsunuz",
        variant: "success",
      });
      void router.push("/dashboard/courses");
    },
    onError: (error) => {
      toast({
        title: "Bir hata oluştu",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateCourse = async (data: CreateCourseSchema) => {
    await createCourseMutation.mutateAsync(data);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Ders Oluştur</h1>
        <p className="text-muted-foreground">
          Bölüme yeni bir ders ekleyin
        </p>
      </div>

      <Form {...createForm}>
        <form onSubmit={createForm.handleSubmit(handleCreateCourse)} className="space-y-6">
          <FormField
            control={createForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ders Adı</FormLabel>
                <FormControl>
                  <Input placeholder="Ders adını giriniz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ders Kodu</FormLabel>
                <FormControl>
                  <Input placeholder="Ders kodunu giriniz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="credit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kredi</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Kredi sayısını giriniz"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bölüm</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Bölüm seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments?.map((department: Department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
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
            disabled={createCourseMutation.isLoading}
          >
            {createCourseMutation.isLoading ? "Oluşturuluyor..." : "Oluştur"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCoursePage;