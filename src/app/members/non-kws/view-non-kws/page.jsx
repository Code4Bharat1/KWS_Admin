"use client"
import Copyright from '@/components/layouts/copyright/copyright';
import { Suspense } from 'react'
import Navbar from '@/components/layouts/navbar/navbar';
import Viewnonkws from '@/components/members/Viewnonkws';

import React from 'react'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar/>
<Viewnonkws/>
        <Copyright/>
        </Suspense>
    </div>
  )
}

export default page;