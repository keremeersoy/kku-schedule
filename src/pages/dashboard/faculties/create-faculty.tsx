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
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Fakülte Oluştur</h1>
        <p className="text-muted-foreground">
          Üniversiteye yeni bir fakülte ekleyin
        </p>
      </div>

      <Form {...createForm}>
        <form onSubmit={createForm.handleSubmit(handleCreateFaculty)} className="space-y-6">
          <FormField
            control={createForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fakülte Adı</FormLabel>
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
          >
            {createFacultyMutation.isLoading ? "Oluşturuluyor..." : "Oluştur"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateFacultyPage;
