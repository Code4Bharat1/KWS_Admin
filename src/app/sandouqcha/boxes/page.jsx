import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import Boxes from '@/components/sandouqcha/boxes'

import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<Boxes/>
        <Copyright/>
    </div>
  )
}

export default page;