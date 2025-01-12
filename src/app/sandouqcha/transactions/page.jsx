"use client"
import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import Transactions from '@/components/sandouqchaTransactions/Transactions'

import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
<Transactions/>
        <Copyright/>
    </div>
  )
}

export default page;