"use client"

import Navbar from '@/components/layouts/navbar/navbar'
import { Suspense } from 'react'
import EditMember from '@/components/members/editMember'

import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
         <Suspense fallback={<div>Loading...</div>}>
        <EditMember/>
        </Suspense>
    </div>
  )
}

export default page;