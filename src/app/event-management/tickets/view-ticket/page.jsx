
import ViewTicket from '@/components/eventManagement/ViewTicket'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
       <ViewTicket/>
        <Copyright/>
    </div>
  )
}

export default page