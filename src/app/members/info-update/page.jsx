import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import InfoUpdate from '@/components/members/InfoUpdate'
import React from 'react'


const page = () => {
  return (
    <div>
        <Navbar/>
      <InfoUpdate/>
        <Copyright/>
    </div>
  )
}

export default page