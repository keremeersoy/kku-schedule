import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClassroomSchema, type CreateClassroomSchema } from "@/schemas/classroom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function CreateClassroomPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Fetch faculties
  const { data: faculties, isLoading: isLoadingFaculties } = api.faculty.getAllFaculties.useQuery();

  const form = useForm<CreateClassroomSchema>({
    resolver: zodResolver(createClassroomSchema),
    defaultValues: {
      name: "",
      capacity: 0,
      facultyId: "",
    },
  });

  const { mutate: createClassroom, isLoading } = api.classroom.createClassroom.useMutation({
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Sınıf başarıyla oluşturuldu",
      });
      void router.push("/dashboard/classrooms");
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: CreateClassroomSchema) {
    createClassroom(data);
  }

  if (isLoadingFaculties) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <CardTitle>Yeni Sınıf Oluştur</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="facultyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fakülte</FormLabel>
                      <FormDescription>
                        Sınıfın bağlı olduğu fakülteyi seçin
                      </FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Fakülte seçin" />
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

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sınıf Adı</FormLabel>
                      <FormDescription>
                        Örnek: A101, B203, Lab-1
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="Sınıf adını girin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapasite</FormLabel>
                      <FormDescription>
                        Sınıfın maksimum öğrenci kapasitesi
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Sınıf kapasitesini girin"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    İptal
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Oluşturuluyor..." : "Oluştur"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}