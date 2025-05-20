import { Button } from "@/components/ui/button";
// import { createExamScheduleSchema, type CreateExamScheduleSchema } from "@/schemas/examSchedule"; // TODO: Define this schema
import { useForm, useFieldArray } from "react-hook-form";
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
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { type Faculty } from "@/types"; // Assuming Faculty might be relevant, adjust as needed
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus, CalendarIcon, Trash2 } from "lucide-react"; // Changed icon
import { z } from "zod"; // Added for placeholder schema
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils"; // Assuming you have a utility for cn
import { format } from "date-fns"; // For formatting dates
import { api } from "@/utils/api"; // Uncommented and assuming it's correctly set up
import { useEffect } from "react"; // Removed useState as it's not directly used now
import type { Course } from "@prisma/client"; // For typing fetched courses
import type { TRPCClientErrorLike } from "@trpc/client"; // Import for error typing
import type { AppRouter } from "@/server/api/root"; // Import AppRouter for error typing
import { tr } from 'date-fns/locale'; // Import Turkish locale

const courseExamDetailSchema = z.object({
  courseId: z.string(),
  exam_duration: z.coerce.number().int().min(30, "Sınav süresi en az 30 dakika olmalıdır."),
  student_count: z.coerce.number().int().min(0, "Öğrenci sayısı negatif olamaz."),
});

// Updated schema with Date types and courseExams array
const createExamScheduleSchema = z.object({
  title: z.string().min(1, "Takvim başlığı gereklidir."),
  facultyId: z.string().min(1, "Fakülte seçimi gereklidir."),
  start_date: z.date({ required_error: "Başlangıç tarihi gereklidir." }),
  end_date: z.date({ required_error: "Bitiş tarihi gereklidir." }),
  assistant_count: z.coerce.number().int().min(0, "Asistan sayısı en az 0 olmalıdır."),
  max_classes_per_assistant: z.coerce.number().int().min(1, "Asistan başına maksimum ders sayısı en az 1 olmalıdır."),
  courseExams: z.array(courseExamDetailSchema).min(1, "En az bir ders için sınav detayı girilmelidir."), // New field
}).refine((data) => data.end_date.getTime() > data.start_date.getTime(), { // Use getTime() for robust date comparison
  message: "Bitiş tarihi başlangıç tarihinden sonra olmalıdır.",
  path: ["end_date"], 
});
type CreateExamScheduleSchema = z.infer<typeof createExamScheduleSchema>;

const CreateExamSchedulePage = () => {
  const router = useRouter();
  const { data: faculties, isLoading: facultiesLoading } = api.faculty.getAllFaculties.useQuery(); 
  
  const createForm = useForm<CreateExamScheduleSchema>({
    resolver: zodResolver(createExamScheduleSchema),
    defaultValues: {
      title: "",
      facultyId: "",
      assistant_count: 0,
      max_classes_per_assistant: 1,
      courseExams: [],
    },
  });

  const { fields, replace } = useFieldArray({ // Changed to replace for full control on faculty change
    control: createForm.control,
    name: "courseExams"
  });

  const selectedFacultyId = createForm.watch("facultyId");

  const { data: facultyCourses, isLoading: coursesLoading } = api.course.getCoursesByFacultyId.useQuery(
    { facultyId: selectedFacultyId! }, 
    { 
      enabled: !!selectedFacultyId, 
      onSuccess: (data) => {
        if (data) {
          const newCourseExams = data.map(course => ({ 
            courseId: course.id, 
            exam_duration: 60, // Varsayılan sınav süresi
            student_count: 0,  // Varsayılan öğrenci sayısı
          }));
          replace(newCourseExams); // Replace entire array to reflect new faculty's courses
          createForm.trigger("courseExams"); // Trigger validation for the array
        } else {
          replace([]); // Clear courses if no data
        }
      },
      onError: () => {
        replace([]); // Clear courses on error
        toast({
          title: "Dersler Yüklenemedi",
          description: "Fakülteye ait dersler yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    }
  );

  // TODO: Replace with actual API call for creating exam schedules
  const createExamScheduleMutation = api.examSchedule.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Sınav Takvimi başarıyla oluşturuldu",
        description: "Sınav Takvimleri sayfasına yönlendiriliyorsunuz.",
        variant: "success",
      });
      void router.push("/dashboard/exam-schedules");
      createForm.reset(); // Reset form on successful submission
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => { // Typed the error parameter
      toast({
        title: "Bir hata oluştu",
        description: error.data?.zodError?.fieldErrors.courseExams 
          ? "Ders sınav detaylarında hata var." 
          : error.data?.zodError?.fieldErrors.end_date
          ? error.data.zodError.fieldErrors.end_date[0]
          : error.message || "Takvim oluşturulamadı",
        variant: "destructive",
      });
    },
  });

  const handleCreateExamSchedule = async (data: CreateExamScheduleSchema) => {
    // console.log("Form Data Submitted:", data); // For debugging
    await createExamScheduleMutation.mutateAsync(data);
    // Catch block removed as onError handles it in the mutation
  };
  
  // Effect to clear courseExams if facultyId is cleared
  useEffect(() => {
    if (!selectedFacultyId) {
      replace([]);
    }
  }, [selectedFacultyId, replace]);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="w-full">
        <CardHeader>
           <div className="flex items-center space-x-3">
            <CalendarPlus className="h-7 w-7 text-primary" />
            <div>
              <CardTitle className="text-2xl">Yeni Sınav Takvimi Oluştur</CardTitle>
              <CardDescription className="mt-1">
                Yeni bir sınav takvimi oluşturmak için gerekli alanları doldurun ve derslerin sınav sürelerini belirtin.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateExamSchedule)} className="space-y-8">
              <FormField
                control={createForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Takvim Başlığı</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground">
                      Sınav takviminin başlığını girin (örn: Güz Dönemi Ara Sınavları).
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Takvim başlığını giriniz" {...field} />
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
                      Sınav takviminin hangi fakülteye ait olduğunu seçin.
                    </FormDescription>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      disabled={facultiesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={facultiesLoading ? "Yükleniyor..." : "Fakülte seçiniz"} />
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
                control={createForm.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Başlangıç Tarihi</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: tr })
                            ) : (
                              <span>Bir tarih seçin</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs text-muted-foreground mt-1">
                      Sınav takviminin başlangıç tarihini seçin.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Bitiş Tarihi</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: tr })
                            ) : (
                              <span>Bir tarih seçin</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            createForm.getValues("start_date") ? date < createForm.getValues("start_date") : false
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs text-muted-foreground mt-1">
                      Sınav takviminin bitiş tarihini seçin.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="assistant_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asistan Sayısı</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground">
                      Kullanılabilir asistan sayısını girin.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} onChange={event => field.onChange(+event.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="max_classes_per_assistant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asistan Başına Maks. Ders</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground">
                      Bir asistanın en fazla kaç derse girebileceğini belirtin.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} onChange={event => field.onChange(+event.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
 
              {/* Dynamic Course Exam Details Section - UI İyileştirmesi */}
              {selectedFacultyId && !coursesLoading && facultyCourses && facultyCourses.length > 0 && (
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Ders Sınav Detayları</h3>
                  <FormDescription className="text-xs text-muted-foreground">
                    Seçili fakülteye ait dersler için sınav sürelerini (dk) ve öğrenci sayılarını girin.
                  </FormDescription>
                  <div className="space-y-4 pr-2">
                    {fields.map((item, index) => {
                      const course = facultyCourses.find(c => c.id === item.courseId);
                      if (!course) return null; 
                      return (
                        <div key={item.id} className="p-4 rounded-md border bg-muted/20 space-y-3">
                          <div>
                            <p className="text-sm font-semibold text-primary">{course.name}</p>
                            <p className="text-xs text-muted-foreground">Ders Kodu: {course.code}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 items-end">
                            <FormField
                              control={createForm.control}
                              name={`courseExams.${index}.exam_duration`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Sınav Süresi (dk)</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="Örn: 60" {...field} onChange={event => field.onChange(+event.target.value)} />
                                  </FormControl>
                                  <FormMessage className="text-xs"/>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={createForm.control}
                              name={`courseExams.${index}.student_count`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Öğrenci Sayısı</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="Örn: 75" {...field} onChange={event => field.onChange(+event.target.value)} />
                                  </FormControl>
                                  <FormMessage className="text-xs"/>
                                </FormItem>
                              )}
                            />
                          </div>
                           <Input 
                              type="hidden" 
                              {...createForm.register(`courseExams.${index}.courseId`)} 
                              defaultValue={course.id}
                            />
                        </div>
                      );
                    })}
                  </div>
                  {createForm.formState.errors.courseExams && (
                     <FormMessage className="mt-2 text-sm">
                       {createForm.formState.errors.courseExams.message || createForm.formState.errors.courseExams.root?.message || "Lütfen tüm dersler için geçerli sınav süreleri ve öğrenci sayıları girin."}
                     </FormMessage>
                  )}
                </div>
              )}
              {selectedFacultyId && coursesLoading && <p className="text-sm text-muted-foreground text-center py-4">Dersler yükleniyor...</p>}
              {selectedFacultyId && !coursesLoading && (!facultyCourses || facultyCourses.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">Seçili fakülteye ait ders bulunamadı.</p>
              )}

              <Button
                type="submit"
                disabled={!!(createExamScheduleMutation.isLoading || facultiesLoading || (!!selectedFacultyId && coursesLoading))}
                className="w-full md:w-auto mt-8 pt-3 pb-3" /* Ensured mt is sufficient */
              >
                {createExamScheduleMutation.isLoading ? "Oluşturuluyor..." : "Sınav Takvimini Oluştur"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateExamSchedulePage; 