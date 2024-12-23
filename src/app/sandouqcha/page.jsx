import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import Overview from '@/components/sandouqcha/overview'
import Sandouqchaglance from '@/components/sandouqcha/sandouqchaglance'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
      <Overview/>
      <Sandouqchaglance/>
        <Copyright/>
    </div>
  )
}

export default page;