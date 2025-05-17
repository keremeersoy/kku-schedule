import { Button } from "@/components/ui/button";
import { createCourseSchema, type CreateCourseSchema } from "@/schemas/course";
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
import { type Department } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

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
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <BookOpen className="h-7 w-7 text-primary" />
            <div>
              <CardTitle className="text-2xl">Yeni Ders Oluştur</CardTitle>
              <CardDescription className="mt-1">
                Bölüme yeni bir ders ekleyin ve gerekli alanları doldurun.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateCourse)} className="space-y-8">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ders Adı</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground">
                      Dersin tam adını girin (örn: Programlamaya Giriş).
                    </FormDescription>
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
                    <FormDescription className="text-xs text-muted-foreground">
                      Dersin benzersiz kodunu girin (örn: CENG101).
                    </FormDescription>
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
                    <FormDescription className="text-xs text-muted-foreground">
                      Dersin AKTS veya yerel kredi değerini girin.
                    </FormDescription>
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
                    <FormDescription className="text-xs text-muted-foreground">
                      Dersin hangi bölüme ait olduğunu seçin.
                    </FormDescription>
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
                className="w-full md:w-auto"
              >
                {createCourseMutation.isLoading ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCoursePage;