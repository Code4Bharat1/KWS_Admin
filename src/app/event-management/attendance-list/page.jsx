
import AttendanceList from '@/components/eventManagement/AttendanceList'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
       <AttendanceList/>
        <Copyright/>
    </div>
  )
}

export default page