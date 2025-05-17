import { useState } from "react";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import type { Classroom } from "@prisma/client";

interface ClassroomWithFaculty extends Classroom {
  faculty: {
    id: string;
    name: string;
  };
}

interface FacultyGroup {
  faculty: {
    id: string;
    name: string;
  };
  classrooms: ClassroomWithFaculty[];
}

export default function ClassroomsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const utils = api.useContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<{ id: string; name: string } | null>(null);

  // Fetch classrooms grouped by faculty
  const { data: groupedClassrooms, isLoading } = api.classroom.getClassroomsByFaculty.useQuery();

  // Delete mutation
  const { mutate: deleteClassroom, isLoading: isDeleting } = api.classroom.deleteClassroom.useMutation({
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Sınıf başarıyla silindi",
      });
      setDeleteDialogOpen(false);
      setSelectedClassroom(null);
      void utils.classroom.getClassroomsByFaculty.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (classroom: ClassroomWithFaculty) => {
    setSelectedClassroom(classroom);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedClassroom) {
      deleteClassroom({ id: selectedClassroom.id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <ReloadIcon className="h-14 w-14 animate-spin" />
      </div>
    );
  }

  const hasClassrooms = groupedClassrooms && groupedClassrooms.length > 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sınıflar</h1>
          <p className="text-muted-foreground">
            Tüm sınıfların listesi ve kapasiteleri
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/classrooms/create">
            <Plus className="mr-2 h-4 w-4" />
            Sınıf Oluştur
          </Link>
        </Button>
      </div>

      {!hasClassrooms ? (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3 className="text-lg font-medium">Sınıf bulunamadı</h3>
            <p className="text-sm text-muted-foreground">
              Başlamak için ilk sınıfınızı oluşturun.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {(groupedClassrooms as FacultyGroup[]).map((group) => (
            <div key={group.faculty.id} className="space-y-4">
              <h2 className="text-xl font-semibold">{group.faculty.name}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.classrooms.map((classroom) => (
                  <Card key={classroom.id} className="hover:bg-muted/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-semibold">{classroom.name}</h3>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteClick(classroom)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Kapasite: {classroom.capacity} Kişi</p>
                          <p>Oluşturulma: {new Date(classroom.createdAt as Date).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sınıfı Sil</DialogTitle>
            <DialogDescription>
              <p className="mt-2">
                <span className="font-semibold">{selectedClassroom?.name}</span> sınıfını silmek istediğinizden emin misiniz?
              </p>
              <p className="mt-2 text-muted-foreground">
                Bu işlem geri alınamaz ve sınıfa ait tüm sınav planlamaları da silinecektir.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Siliniyor..." : "Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}