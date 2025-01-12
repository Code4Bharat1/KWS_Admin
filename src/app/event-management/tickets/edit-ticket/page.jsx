
import EditTicket from '@/components/eventManagement/EditTicket'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
 <EditTicket/>
        <Copyright/>
    </div>
  )
}

export default page