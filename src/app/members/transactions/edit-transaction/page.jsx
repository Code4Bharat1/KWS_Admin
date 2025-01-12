"use client"
import { Suspense } from 'react'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import EditTransaction from '@/components/memberTransaction/EditTransaction'

import React from 'react'

const page = () => {
  return (
    <div>
        <Suspense fallback={<div>Loading...</div>}>
        <Navbar/>
<EditTransaction/>
        <Copyright/>
        </Suspense>
    </div>
  )
}

export default page;