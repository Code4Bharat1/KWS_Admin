import { Suspense } from 'react'

import UpdateEvent from '@/components/eventManagement/updateEvent'
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Suspense fallback={<div>Loading...</div>}>
        <Navbar/>
       <UpdateEvent/>
       </Suspense>
        <Copyright/>
    </div>
  )
}

export default page