"use client"
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import Search from '@/components/members/search'


import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<Search/>
        <Copyright/>
    </div>
  )
}

export default page;