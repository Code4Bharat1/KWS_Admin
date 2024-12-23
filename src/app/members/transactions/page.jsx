"use client"
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import MemberTransaction from '@/components/memberTransaction/MemberTransaction'

import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<MemberTransaction/>
        <Copyright/>
    </div>
  )
}

export default page;