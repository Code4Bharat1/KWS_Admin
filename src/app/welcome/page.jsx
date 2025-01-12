import React from 'react'
import Navbar from '@/components/layouts/navbar/navbar';

import Copyright from '@/components/layouts/copyright/copyright';
import Welcome from '@/components/staff-portal/dashboard/Welcome';

const page = () => {
  return (
    <div>
<Navbar/>
<Welcome/>
<Copyright/>
    </div>
  )
}

export default page;
