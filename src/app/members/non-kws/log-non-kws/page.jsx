"use client"
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import LogNonkws from '@/components/members/LogNonkws'


import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<LogNonkws/>
        <Copyright/>
    </div>
  )
}

export default page;