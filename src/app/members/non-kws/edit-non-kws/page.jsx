"use client"
import Copyright from '@/components/layouts/copyright/copyright';
import Navbar from '@/components/layouts/navbar/navbar';
import EditNonKws from '@/components/members/Editnonkws';
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<EditNonKws/>
        <Copyright/>
    </div>
  )
}

export default page;