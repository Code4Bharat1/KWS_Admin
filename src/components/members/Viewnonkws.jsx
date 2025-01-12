"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter and useSearchParams
import axios from 'axios';

const Viewnonkws = () => {
  const router = useRouter(); // Initialize useRouter hook
  const searchParams = useSearchParams(); // Access search parameters in Next.js
  const id = searchParams.get('id'); // Get the ID from the query string
  
  const [nonKwsMember, setNonKwsMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the data for the member by ID
  useEffect(() => {
    const fetchNonKwsMember = async () => {
      try {
        const response = await axios.get(`http://localhost:5786/api/nonkws/viewnonkwsmember/${id}`);
        setNonKwsMember(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching member data:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchNonKwsMember();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!nonKwsMember) {
    return <div>Member not found.</div>;
  }

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-4xl font-semibold font-syne mb-6 text-center text-green-800">
        View Non-KWS Member
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4 text-green-600">General Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-green-600">Is Company</label>
            <p>{nonKwsMember.is_company ? 'Yes' : 'No'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">First Name</label>
            <p>{nonKwsMember.first_name}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Middle Name</label>
            <p>{nonKwsMember.middle_name || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Last Name</label>
            <p>{nonKwsMember.last_name}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Gender</label>
            <p>{nonKwsMember.gender}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Marital Status</label>
            <p>{nonKwsMember.marital_status || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Family in Kuwait</label>
            <p>{nonKwsMember.family_in_kuwait || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Zone Member</label>
            <p>{nonKwsMember.zone_member}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Blood Group</label>
            <p>{nonKwsMember.blood_group || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Education Qualification</label>
            <p>{nonKwsMember.education_qualification || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Profession</label>
            <p>{nonKwsMember.profession || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Relation to KWS</label>
            <p>{nonKwsMember.relation_to_kws || 'N/A'}</p>
          </div>
        </div>

        <h2 className="text-2xl mt-6 mb-4 text-green-600">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-green-600">Contact</label>
            <p>{nonKwsMember.contact}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">WhatsApp</label>
            <p>{nonKwsMember.whatsapp || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Email</label>
            <p>{nonKwsMember.email || 'N/A'}</p>
          </div>
        </div>

        <h2 className="text-2xl mt-6 mb-4 text-green-600">Address Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-green-600">Flat No.</label>
            <p>{nonKwsMember.flat_no || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Floor No.</label>
            <p>{nonKwsMember.floor_no || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Block No.</label>
            <p>{nonKwsMember.block_no || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Building Name No.</label>
            <p>{nonKwsMember.building_name_no || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Street Name No.</label>
            <p>{nonKwsMember.street_no_name || 'N/A'}</p>
          </div>

          <div>
            <label className="block mb-2 text-green-600">Area</label>
            <p>{nonKwsMember.area || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewnonkws;
