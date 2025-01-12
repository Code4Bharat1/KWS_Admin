import Profile from '@/components/Profile/Profile'
import ProfileNavbar from '@/components/Profile/ProfileNavbar'
import React from 'react'

const page = () => {
  return (
    <div>
      <ProfileNavbar/>
        <Profile/>
    </div>
  )
}

export default page