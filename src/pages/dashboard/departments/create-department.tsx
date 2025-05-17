import { Button } from "@/components/ui/button";
import { createDepartmentSchema, type CreateDepartmentSchema } from "@/schemas/department";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

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
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Building className="h-7 w-7 text-primary" />
            <div>
              <CardTitle className="text-2xl">Yeni Bölüm Oluştur</CardTitle>
              <CardDescription className="mt-1">
                Fakülteye yeni bir bölüm ekleyin ve gerekli alanları doldurun.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateDepartment)} className="space-y-8">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bölüm Adı</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground">
                      Bölümün tam adını girin (örn: Bilgisayar Mühendisliği).
                    </FormDescription>
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
                    <FormDescription className="text-xs text-muted-foreground">
                      Bölümün hangi fakülteye bağlı olduğunu seçin.
                    </FormDescription>
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
                className="w-full md:w-auto"
              >
                {createDepartmentMutation.isLoading ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDepartmentPage;
