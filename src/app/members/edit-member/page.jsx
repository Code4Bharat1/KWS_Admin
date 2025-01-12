"use client"

import Navbar from '@/components/layouts/navbar/navbar'

import EditMember from '@/components/members/editMember'

import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
        <EditMember/>
    </div>
  )
}

export default page;