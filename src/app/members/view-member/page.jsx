"use client"
import { Suspense } from 'react'

import Navbar from '@/components/layouts/navbar/navbar'
import ViewMember from '@/components/members/viewMember'



import React from 'react'

const page = () => {
  return (
    <div>
       <Suspense fallback={<div>Loading...</div>}>
        <Navbar/>
        <ViewMember/>
        </Suspense>
    </div>
  )
}

export default page;