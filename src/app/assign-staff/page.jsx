
import AssignStaff from '@/components/AssignStaff/AssignStaff'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
   <AssignStaff/>
        <Copyright/>
    </div>
  )
}

export default page