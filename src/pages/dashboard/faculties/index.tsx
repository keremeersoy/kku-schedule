import AllFacultiesArea from '@/components/faculties/all-faculties-area'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const FacultiesPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fakülteler</h1>
          <p className="text-muted-foreground">
            Tüm fakültelerin listesi ve bunlara bağlı bölümler
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/faculties/create-faculty">
            <Plus className="mr-2 h-4 w-4" />
            Fakülte Oluştur
          </Link>
        </Button>
      </div>
      <AllFacultiesArea />
    </div>
  )
}

export default FacultiesPage
