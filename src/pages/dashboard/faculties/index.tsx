import AllFacultiesArea from '@/components/faculties/all-faculties-area'
import React from 'react'

const FacultiesPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fakülteler</h1>
        <p className="text-muted-foreground">
          Tüm fakültelerin listesi ve detayları
        </p>
      </div>
      <AllFacultiesArea />
    </div>
  )
}

export default FacultiesPage
