import { api } from '@/utils/api';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { type Faculty } from '@/types';

const formSchema = z.object({
  name: z.string().min(1, 'Bölüm adı zorunludur'),
  facultyId: z.string().min(1, 'Fakülte seçimi zorunludur'),
});

type FormValues = z.infer<typeof formSchema>;

const CreateDepartmentPage = () => {
  const router = useRouter();
  const { facultyId } = router.query;

  const { data: faculties } = api.faculty.getAllFaculties.useQuery();
  const { mutate: createDepartment, isLoading } = api.department.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Başarıyla bölüm oluşturuldu",
        description: "Fakülte detay sayfasına yönlendiriliyorsunuz",
        variant: "success",
      });
      void router.push('/dashboard/faculties/' + form.getValues('facultyId'));
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      facultyId: facultyId as string || '',
    },
  });

  const onSubmit = (data: FormValues) => {
    createDepartment(data);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Bölüm Oluştur</h1>
        <p className="text-muted-foreground">
          Fakülteye yeni bir bölüm ekleyin
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
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
            control={form.control}
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Oluşturuluyor...' : 'Oluştur'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateDepartmentPage;