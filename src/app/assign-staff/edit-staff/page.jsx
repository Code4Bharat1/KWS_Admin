"use client"
import { Suspense } from 'react'

import EditStaff from '@/components/AssignStaff/EditStaff'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
              <Suspense fallback={<div>Loading...</div>}>
      
        <Navbar/>
  <EditStaff/>
        <Copyright/>
         </Suspense>
    </div>
  )
}

export default page