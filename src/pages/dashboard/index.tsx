import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api } from "@/utils/api";
import { Building, BookOpen, School, Users } from "lucide-react"; // Icons

const App = () => {
  const facultyCount = api.faculty.getAllFaculties.useQuery();
  const departmentCount = api.department.getDepartments.useQuery();
  const courseCount = api.course.getCourses.useQuery();
  const classroomCount = api.classroom.getAllClassrooms.useQuery();

  const summaryItems = [
    {
      title: "Fakülteler",
      count: facultyCount.data?.length ?? 0,
      icon: <School className="h-6 w-6 text-blue-500" />,
      href: "/dashboard/faculties",
      isLoading: facultyCount.isLoading,
      buttonText: "Fakülteleri Yönet"
    },
    {
      title: "Bölümler",
      count: departmentCount.data?.length ?? 0,
      icon: <Building className="h-6 w-6 text-green-500" />,
      href: "/dashboard/departments",
      isLoading: departmentCount.isLoading,
      buttonText: "Bölümleri Yönet"
    },
    {
      title: "Dersler",
      count: courseCount.data?.length ?? 0,
      icon: <BookOpen className="h-6 w-6 text-yellow-500" />,
      href: "/dashboard/courses",
      isLoading: courseCount.isLoading,
      buttonText: "Dersleri Yönet"
    },
    {
      title: "Sınıflar",
      count: classroomCount.data?.length ?? 0,
      icon: <Users className="h-6 w-6 text-purple-500" />,
      href: "/dashboard/classrooms",
      isLoading: classroomCount.isLoading,
      buttonText: "Sınıfları Yönet"
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <Label className="text-2xl font-semibold">Kontrol Paneli</Label>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              {item.isLoading ? (
                <div className="text-2xl font-bold">Yükleniyor...</div>
              ) : (
                <div className="text-2xl font-bold">{item.count}</div>
              )}
              <Link href={item.href} passHref>
                <Button variant="secondary" size="sm" className="mt-4 w-full">
                  {item.buttonText}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default App;
