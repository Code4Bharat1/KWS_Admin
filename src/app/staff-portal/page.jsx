import Copyright from '@/components/layouts/copyright/copyright'
import Dashboard from '@/components/staff-portal/dashboard/dashboard'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
        <Dashboard/>
        <Copyright/>
    </div>
  )
}

export default page