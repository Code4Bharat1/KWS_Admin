import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import { Suspense } from 'react'
import EditBox from '@/components/sandouqcha/editBox'

import React from 'react'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar/>
         
<EditBox/>
        <Copyright/>
        </Suspense>
    </div>
  )
}

export default page;