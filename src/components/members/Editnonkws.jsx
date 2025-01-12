"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter and useSearchParams
import axios from "axios";

const EditNonKws = () => {
  const router = useRouter(); // Initialize useRouter hook
  const searchParams = useSearchParams(); // Access search parameters in Next.js
  const id = searchParams.get("id"); // Get the ID from the query string

  const [nonKwsMember, setNonKwsMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    isCompany: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    maritalStatus: "",
    familyInKuwait: "",
    contact: "",
    whatsapp: "",
    email: "",
    zoneMember: "",
    bloodGroup: "",
    educationQualification: "",
    profession: "",
    relationToKws: "",
    flatNo: "",
    floorNo: "",
    blockNo: "",
    buildingNameNo: "",
    streetNameNo: "",
    area: "",
  }); // Initialize an empty formData object with keys matching backend fields

  // Fetch the data for the member by ID
  useEffect(() => {
    const fetchNonKwsMember = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5786/api/nonkws/view/${id}`
        );
        setNonKwsMember(response.data);
        setFormData(response.data); // Initialize the form data from the fetched member data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching member data:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchNonKwsMember();
    }
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || "" }));  // Ensure the value is never null or undefined
  };
  

  // Submit the edited data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User not authenticated");
      return;
    }

    // Include committed_by in the form data
    const formDataWithCommittedBy = { ...formData, committed_by: userId };
    console.log("Submitting form with data:", formData); // Add this line to debug form data

    try {
      const response = await axios.put(
        `http://localhost:5786/api/nonkws/editnonkwsmember/${id}`,
        formDataWithCommittedBy
      );
      console.log("Response:", response); // Log the response to see if it's successful
      alert("Member details updated successfully");
      router.push(`/members/non-kws`); // Redirect after successful update
    } catch (error) {
      console.error("Error updating member data:", error);
      alert("Error updating member details");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!nonKwsMember) {
    return <div>Member not found.</div>;
  }

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-4xl font-semibold font-syne mb-6 text-center text-green-800">
        Edit Non-KWS Member
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4 text-green-600">General Information</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-green-600">Is Company</label>
              <select
                name="isCompany"
                value={formData.isCompany}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-green-600">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter First Name"
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Middle Name</label>
              <input
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Middle Name"
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Last Name"
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-green-600">Marital Status</label>
              <input
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Marital Status"
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Family in Kuwait</label>
              <input
                name="familyInKuwait"
                value={formData.familyInKuwait}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Family in Kuwait"
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Zone Member</label>
              <input
                name="zoneMember"
                value={formData.zoneMember}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Zone Member"
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Blood Group</label>
              <input
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Blood Group"
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Education Qualification</label>
              <input
                name="educationQualification"
                value={formData.educationQualification}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Education Qualification"
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Profession</label>
              <input
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Profession"
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Relation to KWS</label>
              <input
                name="relationToKws"
                value={formData.relationToKws}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Relation to KWS"
              />
            </div>
          </div>

          <h2 className="text-2xl mt-6 mb-4 text-green-600">Contact Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-green-600">Contact</label>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Contact"
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">WhatsApp</label>
              <input
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter WhatsApp"
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Email"
              />
            </div>
          </div>

          <h2 className="text-2xl mt-6 mb-4 text-green-600">Address Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-green-600">Flat No.</label>
              <input
                name="flatNo"
                value={formData.flatNo}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Flat No."
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Floor No.</label>
              <input
                name="floorNo"
                value={formData.floorNo}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Floor No."
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Block No.</label>
              <input
                name="blockNo"
                value={formData.blockNo}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Block No."
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Building Name No.</label>
              <input
                name="buildingNameNo"
                value={formData.buildingNameNo}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Building Name No."
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Street Name No.</label>
              <input
                name="streetNameNo"
                value={formData.streetNameNo}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Street Name No."
              />
            </div>

            <div>
              <label className="block mb-2 text-green-600">Area</label>
              <input
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
                placeholder="Enter Area"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditNonKws;
