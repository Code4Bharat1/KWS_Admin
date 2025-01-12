import ScanAttendance from '@/components/eventManagement/ScanAttendance'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
       <ScanAttendance/>
        <Copyright/>
    </div>
  )
}

export default page;