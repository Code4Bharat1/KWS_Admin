import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import EditTransaction from '@/components/sandouqchaTransactions/EditTransaction'

import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<EditTransaction/>
        <Copyright/>
    </div>
  )
}

export default page;