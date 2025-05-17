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
import { Card, CardContent } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import type { Classroom } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        variant: "success"
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
      <div className="flex items-center justify-between mb-8">
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
        <div className="space-y-10">
          {(groupedClassrooms as FacultyGroup[]).map((group) => (
            <div key={group.faculty.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h2 className="text-2xl font-semibold tracking-tight mb-4 text-primary">{group.faculty.name}</h2>
              {group.classrooms.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium text-muted-foreground w-[300px]">Sınıf Adı</TableHead>
                      <TableHead className="font-medium text-muted-foreground">Kapasite</TableHead>
                      <TableHead className="font-medium text-muted-foreground">Oluşturulma Tarihi</TableHead>
                      <TableHead className="font-medium text-muted-foreground text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.classrooms.map((classroom) => (
                      <TableRow key={classroom.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="py-3 font-medium flex items-center">
                          <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                          {classroom.name}
                        </TableCell>
                        <TableCell className="py-3">{classroom.capacity} Kişi</TableCell>
                        <TableCell className="py-3">
                          {new Date(
                            classroom.createdAt as Date
                          ).toLocaleDateString("tr-TR")}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(classroom)}
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Sil
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground py-3">
                  Bu fakülteye ait sınıf bulunmamaktadır.
                </p>
              )}
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