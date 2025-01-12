
import UpdateEvent from '@/components/eventManagement/updateEvent'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
       <UpdateEvent/>
        <Copyright/>
    </div>
  )
}

export default page