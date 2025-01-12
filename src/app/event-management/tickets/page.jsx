
import Tickets from '@/components/eventManagement/Tickets'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
       <Tickets/>
        <Copyright/>
    </div>
  )
}

export default page