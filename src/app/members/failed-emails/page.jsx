"use client"
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import FailedEmails from '@/components/members/FailedEmails'



import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<FailedEmails/>
        <Copyright/>
    </div>
  )
}

export default page;