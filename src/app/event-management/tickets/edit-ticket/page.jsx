import { Suspense } from 'react'

import EditTicket from '@/components/eventManagement/EditTicket'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}></Suspense>
        <Navbar/>
 <EditTicket/>
        <Copyright/>
    </div>
  )
}

export default page