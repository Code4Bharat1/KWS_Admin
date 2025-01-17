import Copyright from '@/components/layouts/copyright/copyright'
import { Suspense } from 'react'

import Navbar from '@/components/layouts/navbar/navbar'
import EditTransaction from '@/components/sandouqchaTransactions/EditTransaction'

import React from 'react'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar/>
<EditTransaction/>
        <Copyright/>
        </Suspense>
    </div>
  )
}

export default page;