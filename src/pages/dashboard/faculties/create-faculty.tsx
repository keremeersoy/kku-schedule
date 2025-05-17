import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School } from "lucide-react";
import { FormDescription as ShadcnFormDescription } from "@/components/ui/form";

const CreateFacultyPage = () => {
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
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <School className="h-7 w-7 text-primary" />
            <div>
              <CardTitle className="text-2xl">Yeni Fakülte Oluştur</CardTitle>
              <CardDescription className="mt-1">
                Üniversiteye yeni bir fakülte ekleyin ve gerekli alanları doldurun.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateFaculty)} className="space-y-8">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fakülte Adı</FormLabel>
                    <ShadcnFormDescription className="text-xs text-muted-foreground">
                      Fakültenin tam adını girin (örn: Mühendislik Fakültesi).
                    </ShadcnFormDescription>
                    <FormControl>
                      <Input placeholder="Fakülte adını giriniz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={createFacultyMutation.isLoading}
                className="w-full md:w-auto"
              >
                {createFacultyMutation.isLoading ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFacultyPage;
