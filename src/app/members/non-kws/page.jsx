"use client"
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import NonKws from '@/components/members/NonKws'


import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<NonKws/>
        <Copyright/>
    </div>
  )
}

export default page;