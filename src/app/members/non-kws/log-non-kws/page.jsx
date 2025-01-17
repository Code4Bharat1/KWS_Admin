"use client"
import Copyright from '@/components/layouts/copyright/copyright'
import { Suspense } from 'react'
import Navbar from '@/components/layouts/navbar/navbar'
import LogNonkws from '@/components/members/LogNonkws'


import React from 'react'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar/>
<LogNonkws/>
        <Copyright/>
        </Suspense>
    </div>
  )
}

export default page;