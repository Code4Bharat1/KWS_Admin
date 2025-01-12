"use client"
import Copyright from '@/components/layouts/copyright/copyright';
import Navbar from '@/components/layouts/navbar/navbar';
import Addnonkws from '@/components/members/Addnonkws';

import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<Addnonkws/>
        <Copyright/>
    </div>
  )
}

export default page;