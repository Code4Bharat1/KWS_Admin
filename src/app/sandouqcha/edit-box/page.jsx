import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import EditBox from '@/components/sandouqcha/editBox'

import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<EditBox/>
        <Copyright/>
    </div>
  )
}

export default page;