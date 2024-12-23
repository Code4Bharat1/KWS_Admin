import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'
import Review from '@/components/members/review'

const page = () => {
  return (
    <div>
        <Navbar/>
       <Review/>
        <Copyright/>
    </div>
  )
}

export default page