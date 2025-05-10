import Copyright from '@/components/layouts/copyright/copyright'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'
import Review from '@/components/members/review'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
const page = () => {
  return (
    <div>
        <Navbar/>
       <Review/>
        <Copyright/>
        <ToastContainer/>
    </div>
  )
}

export default page