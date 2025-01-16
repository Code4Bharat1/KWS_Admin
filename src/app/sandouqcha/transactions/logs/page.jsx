"use client"
import { Suspense } from 'react'

import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'

import React from 'react'
import Logs from '@/components/sandouqchaTransactions/Logs'

const page = () => {
  return (
    <div>
        <Suspense fallback={<div>Loading...</div>}>
        <Navbar/>
<Logs/>
        <Copyright/>
        </Suspense>
    </div>
  )
}

export default page;