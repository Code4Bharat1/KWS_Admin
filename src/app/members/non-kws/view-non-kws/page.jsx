"use client"
import Copyright from '@/components/layouts/copyright/copyright';
import Navbar from '@/components/layouts/navbar/navbar';
import Viewnonkws from '@/components/members/Viewnonkws';

import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<Viewnonkws/>
        <Copyright/>
    </div>
  )
}

export default page;