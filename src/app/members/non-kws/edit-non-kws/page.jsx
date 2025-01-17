"use client"
import Copyright from '@/components/layouts/copyright/copyright';
import { Suspense } from 'react'
import Navbar from '@/components/layouts/navbar/navbar';
import EditNonKws from '@/components/members/Editnonkws';
import React from 'react'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar/>
<EditNonKws/>
        <Copyright/>
        </Suspense>
    </div>
  )
}

export default page;