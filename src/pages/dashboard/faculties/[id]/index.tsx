import { api } from '@/utils/api';
import { useRouter } from 'next/router';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FacultyDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: faculty, isLoading } = api.faculty.getFacultyById.useQuery(
    { id: id as string },
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <ReloadIcon className="h-14 w-14 animate-spin" />
      </div>
    );
  }

  if (!faculty) {
    return <div>Fakülte bulunamadı</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{faculty.name}</h1>
          <p className="text-muted-foreground">Fakülte detayları ve bölümleri</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/departments/create?facultyId=${faculty.id}`}>
            Yeni Bölüm Oluştur
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {faculty.departments?.map((department) => (
          <Card key={department.id}>
            <CardHeader>
              <CardTitle>{department.name}</CardTitle>
              <CardDescription>Bölüm Detayları</CardDescription>
            </CardHeader>
          </Card>
        ))}
        {faculty.departments?.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            Bu fakülteye ait bölüm bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDetailPage;