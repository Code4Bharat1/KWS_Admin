import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import ViewBox from '@/components/sandouqcha/viewBox'

import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<ViewBox/>
        <Copyright/>
    </div>
  )
}

export default page;