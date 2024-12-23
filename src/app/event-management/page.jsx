
import Events from '@/components/eventManagement/Events'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
       <Events/>
        <Copyright/>
    </div>
  )
}

export default page