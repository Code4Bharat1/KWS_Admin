import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import BulkTransaction from '@/components/sandouqchaTransactions/BulkTransaction'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
        <BulkTransaction/>
        <Copyright/>
    </div>
  )
}

export default page