"use client"

import Navbar from '@/components/layouts/navbar/navbar'
import { Suspense } from 'react'
import EditMember from '@/components/members/editMember'

import React from 'react'
import Nextprevbuttons from '@/components/members/Nextprevbuttons'

const page = () => {
  return (
    <div>
        <Navbar/>
         <Suspense fallback={<div>Loading...</div>}>
        <EditMember/>
        <Nextprevbuttons/>
        </Suspense>
    </div>
  )
}

export default page;