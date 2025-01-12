import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import ViewTransaction from '@/components/sandouqchaTransactions/ViewTransaction'

import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<ViewTransaction/>
        <Copyright/>
    </div>
  )
}

export default page;