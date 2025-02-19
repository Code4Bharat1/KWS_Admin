"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import Select from "react-select";


const EditMember = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id"); 


  const [userData, setUserData] = useState({});
  const [kwsidError, setKwsidError] = useState("");
  const [isKwsidChanged, setIsKwsidChanged] = useState(false); 

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");


  const memberOptions = [
    { value: "PRIVILEGE MEMBER", label: "PRIVILEGE MEMBER" },
    { value: "ADVISOR", label: "ADVISOR" },
    { value: "CC MEMBER", label: "CC MEMBER" },
    { value: "DONORS", label: "DONORS" },
    { value: "LIFETIME MEMBER", label: "LIFETIME MEMBER" },
    { value: "SENIOR VICE PRESIDENT", label: "SENIOR VICE PRESIDENT" },
    { value: "ASSISTANT GENERAL SECRETARY", label: "ASSISTANT GENERAL SECRETARY" },
    { value: "ASSISTANT TREASURER", label: "ASSISTANT TREASURER" },
    { value: "EC MEMBER", label: "EC MEMBER" },
    { value: "ELITE MEMBER", label: "ELITE MEMBER" },
    { value: "EX OFFICIO PRESIDENT", label: "EX OFFICIO PRESIDENT" },
    { value: "GENERAL SECRETARY", label: "GENERAL SECRETARY" },
    { value: "JOINT GENERAL SECRETARY", label: "JOINT GENERAL SECRETARY" },
    { value: "JOINT TREASURER", label: "JOINT TREASURER" },
    { value: "LADIES EC MEMBER", label: "LADIES EC MEMBER" },
    { value: "PATRON", label: "PATRON" },
    { value: "PRESIDENT", label: "PRESIDENT" },
    { value: "TREASURER", label: "TREASURER" },
    { value: "VENDORS", label: "VENDORS" },
    { value: "VICE PRESIDENT", label: "VICE PRESIDENT" },
    { value: "VC MEMBER", label: "VC MEMBER" },
    { value: "LADIES CC MEMBER", label: "LADIES CC MEMBER" },
    { value: "LADIES VC MEMBER", label: "LADIES VC MEMBER" },
    { value: "LADIES ELITE MEMBER", label: "LADIES ELITE MEMBER" },
    { value: "LADIES PRIVILEGE MEMBER", label: "LADIES PRIVILEGE MEMBER" },
  ];

  const handleMemberTypeChange = (selectedOptions) => {
    if (selectedOptions.length > 2) {
      alert("You can select a maximum of 2 types.");
      return;
    }
  
    const selectedValues = selectedOptions.map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      type_of_member: selectedValues.join(","), // Store as comma-separated string
    }));
  };
  // Fetch member data based on userId
  useEffect(() => {
    if (!userId) {
      setErrorMessage("No member ID provided.");
      setLoading(false);
      return;
    }
  
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/get/${userId}`);
        const userDataFetched  = response.data.data;
      
 
  
        // Format date of birth if available
        if (userDataFetched .dob) {
          userDataFetched .dob = new Date(userDataFetched .dob).toISOString().split("T")[0];
        }
        setUserData(userDataFetched );
        setFormData(userDataFetched );
  
        // Set profile picture preview if available
        if (userDataFetched.profile_picture) {
          setProfilePicturePreview(userDataFetched.profile_picture);
        }
      } catch (error) {
        console.error("Member Not Found", error);
        setErrorMessage("Member Not Found");
      } finally {
        setLoading(false);
      }
    };
  
    fetchMemberData();
  }, [userId]);

  


 

  useEffect(() => {
    if (!formData.kwsid || !isKwsidChanged) {
      setKwsidError(""); // Clear error when empty or not changed
      return;
    }
  
    const source = axios.CancelToken.source();
  
    const checkKWSID = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/auth/kwsid`,
          {
            params: { kwsid: formData.kwsid },
            cancelToken: source.token,
          }
        );
  
        if (response.data.exists) {
          setKwsidError("KWS ID already exists."); // Show error only if ID exists
        } else {
          setKwsidError(""); // Clear error if unique
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error checking KWS ID:", error);
        }
      }
    };
  
    const delayDebounceFn = setTimeout(checkKWSID, 500);
  
    return () => {
      clearTimeout(delayDebounceFn);
      source.cancel();
    };
  }, [formData.kwsid, isKwsidChanged]);



  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    // If user modifies the KWS ID, mark it as changed
    if (name === "kwsid") {
      setIsKwsidChanged(true);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];



    if (file) {
    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
      return;
    }

    if (file.size > maxSizeInBytes) {
      setErrorMessage("Profile picture exceeds the 2MB size limit.");
      return;
    }

      setFormData((prevData) => ({
        ...prevData,
        profile_picture: file,
      }));

      setProfilePicturePreview(URL.createObjectURL(file)); // Preview the image
      setErrorMessage(""); // Clear any previous error message
    }
  };
  // Remove profile picture
 const handleRemoveProfilePicture = () => {
  setFormData((prevData) => ({ ...prevData, profile_picture: null }));
  setProfilePicturePreview(null); // Remove the preview
};
const handleRemoveScannedForm = () => {
  setFormData((prevData) => ({ ...prevData, form_scanned: null }));
};


  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Only pick the first file
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (file.size > maxSizeInBytes) {
        setErrorMessage(`File ${file.name} exceeds the 2MB size limit.`);
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        form_scanned: file, // Save the file
      }));
      setErrorMessage(""); // Clear any previous error message
    }
  };


 


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      const formDataToSend = new FormData();
  
      // Append form fields to FormData
      for (const key in formData) {
        if (key === "form_scanned" && formData[key] instanceof File) {
          formDataToSend.append("form_scanned", formData[key]);
        } else if (key === "profile_picture" && formData[key] instanceof File) {
          formDataToSend.append("profile_picture", formData[key]);
        } else if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      }
  
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/editprofile/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      // console.log("Update response:", response.data);
      setSuccessMessage("Member information updated successfully.");
    } catch (error) {
      console.error("Error updating member data:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "An error occurred while updating the member data.");
      window.location.reload();
    }
  };
  

  // Function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format as 'MM/DD/YYYY'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-500 text-xl">{errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Edit Member
      </h1>
      <h1  className="text-xl md:text-3xl text-[#355F2E] font-semibold text-center mb-6">KWS ID : {formData.kwsid}</h1>

      {/* Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {/* Personal Details Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Civil ID */}
              <div>
                <label htmlFor="civil_id" className="block text-sm font-medium text-gray-700">
                  Civil ID
                </label>
                <input
                  type="text"
                  name="civil_id"
                  id="civil_id"
                  value={formData.civil_id || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  // required
                />
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={formData.first_name || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  // required
                />
              </div>

              {/* Middle Name */}
              <div>
                <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middle_name"
                  id="middle_name"
                  value={formData.middle_name || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={formData.last_name || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  // required
                />
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  // required
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label htmlFor="blood_group" className="block text-sm font-medium text-gray-700">
                  Blood Group
                </label>
                <select
                  name="blood_group"
                  id="blood_group"
                  value={formData.blood_group || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select blood group
                  </option>
                  <option value="NA">NA</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* Education Qualification */}
              <div>
                <label htmlFor="education_qualification" className="block text-sm font-medium text-gray-700">
                  Education Qualification
                </label>
                <input
                  type="text"
                  name="education_qualification"
                  id="education_qualification"
                  value={formData.education_qualification || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Profession */}
              <div>
                <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                  Profession
                </label>
                <input
                  type="text"
                  name="profession"
                  id="profession"
                  value={formData.profession || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Kuwait Contact */}
              <div>
                <label htmlFor="kuwait_contact" className="block text-sm font-medium text-gray-700">
                  Kuwait Contact
                </label>
                <input
                  type="text"
                  name="kuwait_contact"
                  id="kuwait_contact"
                  value={formData.kuwait_contact || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Kuwait Whatsapp */}
              <div>
                <label htmlFor="kuwait_whatsapp" className="block text-sm font-medium text-gray-700">
                  Kuwait Whatsapp
                </label>
                <input
                  type="text"
                  name="kuwait_whatsapp"
                  id="kuwait_whatsapp"
                  value={formData.kuwait_whatsapp || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Marital Status */}
              <div>
                <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">
                  Marital Status
                </label>
                <select
                  name="marital_status"
                  id="marital_status"
                  value={formData.marital_status || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select marital status
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </div>

              {/* Family in Kuwait */}
              <div>
                <label htmlFor="family_in_kuwait" className="block text-sm font-medium text-gray-700">
                  Family in Kuwait
                </label>
                <select
                  name="family_in_kuwait"
                  id="family_in_kuwait"
                  value={formData.family_in_kuwait || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

       {/* Profile Picture Section */}
<div className="mt-6 flex flex-col items-center">
  <label className="text-lg font-medium text-gray-800 mb-4">Profile Picture (2MB Max)</label>
<h1 className="mb-4 text-red-500">Only JPG/ JPEG / PNG images are allowed*</h1>
  {/* Check if there's a profile picture preview */}
  {profilePicturePreview ? (
    <div className="relative group">
      <img
        src={profilePicturePreview} // Display the uploaded preview
        alt="Profile Preview"
        className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-gray-300"
      />
      {/* <button
        type="button"
        onClick={handleRemoveProfilePicture}
        className="absolute top-2 right-2 bg-red-600 text-white text-sm p-1 rounded-full shadow-md hover:bg-red-700 transition-all duration-200"
      >
        &times;
      </button> */}

      {/* Profile Picture Upload Button */}
      <label
        htmlFor="profilePictureUpload"
        className="mt-2 flex items-center justify-center w-48 h-12 border-2 border-blue-500 rounded-lg cursor-pointer hover:bg-blue-100 transition-all duration-200"
      >
        <span className="text-blue-500">Change Picture</span>
        <input
          type="file"
          id="profilePictureUpload"
          accept="image/*"
          onChange={handleProfilePictureChange}
          className="hidden"
        />
      </label>
    </div>
  ) : userData.profile_picture ? ( // If no preview, check for existing profile picture
    <div className="relative group">
      <img
        src={userData.profile_picture} // Display the existing profile picture from userData
        alt="Current Profile Picture"
        className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-gray-300"
      />
      <button
        type="button"
        onClick={handleRemoveProfilePicture}
        className="absolute top-2 right-2 bg-red-600 text-white text-sm p-1 rounded-full shadow-md hover:bg-red-700 transition-all duration-200"
      >
        &times;
      </button>
      
      {/* Profile Picture Upload Button */}
      <label
        htmlFor="profilePictureUpload"
        className="mt-2 flex items-center justify-center w-48 h-12 border-2 border-black rounded-lg cursor-pointer hover:bg-blue-100 transition-all duration-200"
      >
        <span className="text-black">Change Picture</span>
        <input
          type="file"
          id="profilePictureUpload"
          accept="image/*"
          onChange={handleProfilePictureChange}
          className="hidden"
        />
      </label>
    </div>
  ) : (
    // If no picture is available, show the upload button
    <label
      htmlFor="profilePictureUpload"
      className="mt-2 flex flex-col justify-center items-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-blue-500 transition-all duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-gray-500 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 16l4-4m0 0l-4-4m4 4H8m8 4v6m0-6H8"
        />
      </svg>
      <span className="text-gray-500 text-sm">Upload Profile Picture</span>
      <input
        type="file"
        id="profilePictureUpload"
        accept="image/*"
        onChange={handleProfilePictureChange} // Handle the file upload
        className="hidden"
      />
    </label>
  )}
</div>




         
          {/* Address (Kuwait) Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Address (Kuwait)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Flat No */}
              <div>
                <label htmlFor="flat_no" className="block text-sm font-medium text-gray-700">
                  Flat No
                </label>
                <input
                  type="text"
                  name="flat_no"
                  id="flat_no"
                  value={formData.flat_no || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Floor No */}
              <div>
                <label htmlFor="floor_no" className="block text-sm font-medium text-gray-700">
                  Floor No
                </label>
                <input
                  type="text"
                  name="floor_no"
                  id="floor_no"
                  value={formData.floor_no || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Block No */}
              <div>
                <label htmlFor="block_no" className="block text-sm font-medium text-gray-700">
                  Block No
                </label>
                <input
                  type="text"
                  name="block_no"
                  id="block_no"
                  value={formData.block_no || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Building Name No */}
              <div>
                <label htmlFor="building_name_no" className="block text-sm font-medium text-gray-700">
                  Building Name No
                </label>
                <input
                  type="text"
                  name="building_name_no"
                  id="building_name_no"
                  value={formData.building_name_no || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Street Name No. */}
              <div>
                <label htmlFor="street_no_name" className="block text-sm font-medium text-gray-700">
                  Street Name No.
                </label>
                <input
                  type="text"
                  name="street_no_name"
                  id="street_no_name"
                  value={formData.street_no_name || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Area */}
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                  Area
                </label>
                <input
                  type="text"
                  name="area"
                  id="area"
                  value={formData.area || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Address (India) Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Address (India)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Complete Indian Address */}
              <div>
                <label htmlFor="residence_complete_address" className="block text-sm font-medium text-gray-700">
                  Complete Indian Address
                </label>
                <input
                  type="text"
                  name="residence_complete_address"
                  id="residence_complete_address"
                  value={formData.residence_complete_address || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* PIN No. */}
              <div>
                <label htmlFor="pin_no_india" className="block text-sm font-medium text-gray-700">
                  PIN No.
                </label>
                <input
                  type="text"
                  name="pin_no_india"
                  id="pin_no_india"
                  value={formData.pin_no_india || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Address (Permanent Native) Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Address (Permanent Native)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mohalla or Village */}
              <div>
                <label htmlFor="mohalla_village" className="block text-sm font-medium text-gray-700">
                  Mohalla or Village
                </label>
                <input
                  type="text"
                  name="mohalla_village"
                  id="mohalla_village"
                  value={formData.mohalla_village || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Taluka */}
              <div>
                <label htmlFor="taluka" className="block text-sm font-medium text-gray-700">
                  Taluka
                </label>
                <input
                  type="text"
                  name="taluka"
                  id="taluka"
                  value={formData.taluka || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* District */}
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  id="district"
                  value={formData.district || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Native PIN No. */}
              <div>
                <label htmlFor="native_pin_no" className="block text-sm font-medium text-gray-700">
                  Native PIN No.
                </label>
                <input
                  type="text"
                  name="native_pin_no"
                  id="native_pin_no"
                  value={formData.native_pin_no || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Numbers (India) Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Numbers (India)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Indian Contact No. 1 */}
              <div>
                <label htmlFor="indian_contact_no_1" className="block text-sm font-medium text-gray-700">
                  Indian Contact No. 1
                </label>
                <input
                  type="text"
                  name="indian_contact_no_1"
                  id="indian_contact_no_1"
                  value={formData.indian_contact_no_1 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Indian Contact No. 2 */}
              <div>
                <label htmlFor="indian_contact_no_2" className="block text-sm font-medium text-gray-700">
                  Indian Contact No. 2
                </label>
                <input
                  type="text"
                  name="indian_contact_no_2"
                  id="indian_contact_no_2"
                  value={formData.indian_contact_no_2 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Indian Contact No. 3 */}
              <div>
                <label htmlFor="indian_contact_no_3" className="block text-sm font-medium text-gray-700">
                  Indian Contact No. 3
                </label>
                <input
                  type="text"
                  name="indian_contact_no_3"
                  id="indian_contact_no_3"
                  value={formData.indian_contact_no_3 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contacts (Kuwait) Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Emergency Contact (Kuwait)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Emergency Name (Kuwait) */}
              <div>
                <label htmlFor="emergency_name_kuwait" className="block text-sm font-medium text-gray-700">
                  Emergency Name (Kuwait)
                </label>
                <input
                  type="text"
                  name="emergency_name_kuwait"
                  id="emergency_name_kuwait"
                  value={formData.emergency_name_kuwait || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Emergency Contact (Kuwait) */}
              <div>
                <label htmlFor="emergency_contact_kuwait" className="block text-sm font-medium text-gray-700">
                  Emergency Contact (Kuwait)
                </label>
                <input
                  type="text"
                  name="emergency_contact_kuwait"
                  id="emergency_contact_kuwait"
                  value={formData.emergency_contact_kuwait || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contacts (India) Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Emergency Contact (India)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Emergency Name (India) */}
              <div>
                <label htmlFor="emergency_name_india" className="block text-sm font-medium text-gray-700">
                  Emergency Name (India)
                </label>
                <input
                  type="text"
                  name="emergency_name_india"
                  id="emergency_name_india"
                  value={formData.emergency_name_india || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Emergency Contact (India) */}
              <div>
                <label htmlFor="emergency_contact_india" className="block text-sm font-medium text-gray-700">
                  Emergency Contact (India)
                </label>
                <input
                  type="text"
                  name="emergency_contact_india"
                  id="emergency_contact_india"
                  value={formData.emergency_contact_india || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Family Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Family</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Father's Name */}
              <div>
                <label htmlFor="father_name" className="block text-sm font-medium text-gray-700">
                  Father's Name
                </label>
                <input
                  type="text"
                  name="father_name"
                  id="father_name"
                  value={formData.father_name || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Mother's Name */}
              <div>
                <label htmlFor="mother_name" className="block text-sm font-medium text-gray-700">
                  Mother's Name
                </label>
                <input
                  type="text"
                  name="mother_name"
                  id="mother_name"
                  value={formData.mother_name || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Spouse's Name */}
              <div>
                <label htmlFor="spouse_name" className="block text-sm font-medium text-gray-700">
                  Spouse's Name
                </label>
                <input
                  type="text"
                  name="spouse_name"
                  id="spouse_name"
                  value={formData.spouse_name || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Name of First Child */}
              <div>
                <label htmlFor="child_name_1" className="block text-sm font-medium text-gray-700">
                  Name of First Child
                </label>
                <input
                  type="text"
                  name="child_name_1"
                  id="child_name_1"
                  value={formData.child_name_1 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Name of Second Child */}
              <div>
                <label htmlFor="child_name_2" className="block text-sm font-medium text-gray-700">
                  Name of Second Child
                </label>
                <input
                  type="text"
                  name="child_name_2"
                  id="child_name_2"
                  value={formData.child_name_2 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Name of Third Child */}
              <div>
                <label htmlFor="child_name_3" className="block text-sm font-medium text-gray-700">
                  Name of Third Child
                </label>
                <input
                  type="text"
                  name="child_name_3"
                  id="child_name_3"
                  value={formData.child_name_3 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Name of Fourth Child */}
              <div>
                <label htmlFor="child_name_4" className="block text-sm font-medium text-gray-700">
                  Name of Fourth Child
                </label>
                <input
                  type="text"
                  name="child_name_4"
                  id="child_name_4"
                  value={formData.child_name_4 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Name of Fifth Child */}
              <div>
                <label htmlFor="child_name_5" className="block text-sm font-medium text-gray-700">
                  Name of Fifth Child
                </label>
                <input
                  type="text"
                  name="child_name_5"
                  id="child_name_5"
                  value={formData.child_name_5 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {/* Additional Information */}
              <div>
                <label htmlFor="additional_information" className="block text-sm font-medium text-gray-700">
                  Any additional information to pass to KWS on registration
                </label>
                <input
                  type="text"
                  name="additional_information"
                  id="additional_information"
                  value={formData.additional_information || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter additional information"
                />
              </div>
            </div>
          </div>

          {/* MBS Nomination Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">MBS Nomination</h2>
            {/* First Nominee */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="full_name_1" className="block text-sm font-medium text-gray-700">
                  Name of First MBS Nominee
                </label>
                <input
                  type="text"
                  name="full_name_1"
                  id="full_name_1"
                  value={formData.full_name_1 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="relation_1" className="block text-sm font-medium text-gray-700">
                  Relationship
                </label>
                <input
                  type="text"
                  name="relation_1"
                  id="relation_1"
                  value={formData.relation_1 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="percentage_1" className="block text-sm font-medium text-gray-700">
                  Percentage
                </label>
                <input
                  type="number"
                  name="percentage_1"
                  id="percentage_1"
                  value={formData.percentage_1 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label htmlFor="mobile_1" className="block text-sm font-medium text-gray-700">
                  Contact
                </label>
                <input
                  type="text"
                  name="mobile_1"
                  id="mobile_1"
                  value={formData.mobile_1 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Second Nominee */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="full_name_2" className="block text-sm font-medium text-gray-700">
                  Name of Second MBS Nominee
                </label>
                <input
                  type="text"
                  name="full_name_2"
                  id="full_name_2"
                  value={formData.full_name_2 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="relation_2" className="block text-sm font-medium text-gray-700">
                  Relationship
                </label>
                <input
                  type="text"
                  name="relation_2"
                  id="relation_2"
                  value={formData.relation_2 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="percentage_2" className="block text-sm font-medium text-gray-700">
                  Percentage
                </label>
                <input
                  type="number"
                  name="percentage_2"
                  id="percentage_2"
                  value={formData.percentage_2 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label htmlFor="mobile_2" className="block text-sm font-medium text-gray-700">
                  Contact
                </label>
                <input
                  type="text"
                  name="mobile_2"
                  id="mobile_2"
                  value={formData.mobile_2 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Third Nominee */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="full_name_3" className="block text-sm font-medium text-gray-700">
                  Name of Third MBS Nominee
                </label>
                <input
                  type="text"
                  name="full_name_3"
                  id="full_name_3"
                  value={formData.full_name_3 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="relation_3" className="block text-sm font-medium text-gray-700">
                  Relationship
                </label>
                <input
                  type="text"
                  name="relation_3"
                  id="relation_3"
                  value={formData.relation_3 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="percentage_3" className="block text-sm font-medium text-gray-700">
                  Percentage
                </label>
                <input
                  type="number"
                  name="percentage_3"
                  id="percentage_3"
                  value={formData.percentage_3 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label htmlFor="mobile_3" className="block text-sm font-medium text-gray-700">
                  Contact
                </label>
                <input
                  type="text"
                  name="mobile_3"
                  id="mobile_3"
                  value={formData.mobile_3 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Fourth Nominee */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 border-b-4 border-black pb-4">
              <div>
                <label htmlFor="full_name_4" className="block text-sm font-medium text-gray-700">
                  Name of Fourth MBS Nominee
                </label>
                <input
                  type="text"
                  name="full_name_4"
                  id="full_name_4"
                  value={formData.full_name_4 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="relation_4" className="block text-sm font-medium text-gray-700">
                  Relationship
                </label>
                <input
                  type="text"
                  name="relation_4"
                  id="relation_4"
                  value={formData.relation_4 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="percentage_4" className="block text-sm font-medium text-gray-700">
                  Percentage
                </label>
                <input
                  type="number"
                  name="percentage_4"
                  id="percentage_4"
                  value={formData.percentage_4 || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label htmlFor="mobile_4" className="block text-sm font-medium text-gray-700">
                  Contact
                </label>
                <input
                  type="text"
                  name="mobile_4"
                  id="mobile_4"
                  value={formData.mobile_4 || ""}
                  onChange={handleChange}
                  className="mt-1 mb-8 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Office Use Section */}
            <div className="mt-6">
              <h2 className="text-4xl mb-4 text-center border-b-4 border-black">Office Use</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Application Date (Printed Only) */}
                <div>
                  <label htmlFor="application_date" className="block text-sm font-medium text-gray-700">
                    Application Date
                  </label>
                  <p className="text-gray-900">
                    {formData.application_date
                      ? formatDate(formData.application_date)
                      : "N/A"}
                  </p>
                </div>

                {/* Type of Member Dropdown */}
                <div>
    <label className="block text-sm font-medium text-gray-700">
      Type of Member (Select up to 2)
    </label>
    <Select
      options={memberOptions}
      isMulti
      value={formData.type_of_member ? formData.type_of_member.split(",").map(value => ({ value, label: value })) : []}
      onChange={handleMemberTypeChange}
      className="mt-1"
      placeholder="Select up to 2..."
    />
  </div>
                {/* Admin Charges Dropdown */}
                <div>
                  <label htmlFor="admin_charges" className="block text-sm font-medium text-gray-700">
                    Admin Charges
                  </label>
                  <select
                    name="admin_charges"
                    id="admin_charges"
                    value={formData.admin_charges || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Amount in KWD */}
                <div>
                  <label htmlFor="amount_in_kwd" className="block text-sm font-medium text-gray-700">
                    Amount (KWD) paid as admin charges
                  </label>
                  <input
                    type="number"
                    name="amount_in_kwd"
                    id="amount_in_kwd"
                    value={formData.amount_in_kwd || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                {/* Form Received By */}
                <div>
                  <label htmlFor="form_recieved_by" className="block text-sm font-medium text-gray-700">
                    Form Received By
                  </label>
                  <input
                    type="text"
                    name="form_recieved_by"
                    id="form_recieved_by"
                    value={formData.form_recieved_by || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Form Scanned Section */}
<div className="mt-6">
  <label htmlFor="form_scanned" className="block text-sm font-medium text-gray-700">
    Scanned Form
  </label>
  <input
    type="file"
    name="form_scanned"
    id="form_scanned"
    accept="image/*"
    onChange={handleImageChange}
    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
  <div className="mt-4">
    {formData.form_scanned instanceof File ? (
      <div className="relative mb-4">
        <img
          src={URL.createObjectURL(formData.form_scanned)}
          alt="Scanned Form"
          className="w-full h-auto rounded-lg border"
        />
        <button
          type="button"
          onClick={handleRemoveScannedForm}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >
          Remove
        </button>
      </div>
    ) : userData.form_scanned ? (
      <div className="relative mb-4">
        <img
          src={userData.form_scanned}
          alt="Uploaded Scanned Form"
          className="w-full h-auto rounded-lg border"
        />
        <button
          type="button"
          onClick={handleRemoveScannedForm}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >
          Remove
        </button>
      </div>
    ) : (
      <p className="text-gray-500">No scanned form uploaded.</p>
    )}
  </div>
</div>

                {/* Card Printed Dropdown */}
                <div>
                  <label htmlFor="card_printed" className="block text-sm font-medium text-gray-700">
                    Card Printed?
                  </label>
                  <select
                    name="card_printed"
                    id="card_printed"
                    value={formData.card_printed || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Card Printed Date */}
                <div>
                  <label htmlFor="card_printed_date" className="block text-sm font-medium text-gray-700">
                    Card Printed Date
                  </label>
                  <input
                    type="date"
                    name="card_printed_date"
                    id="card_printed_date"
                    value={formData.card_printed_date || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Card Expiry Date */}
                <div>
                  <label htmlFor="card_expiry_date" className="block text-sm font-medium text-gray-700">
                    Card Expiry Date
                  </label>
                  <input
                    type="date"
                    name="card_expiry_date"
                    id="card_expiry_date"
                    value={formData.card_expiry_date || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Zone Member Dropdown */}
                <div>
                  <label htmlFor="zone_member" className="block text-sm font-medium text-gray-700">
                    Zone Member
                  </label>
                  <select
                    name="zone_member"
                    id="zone_member"
                    value={formData.zone_member || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Fahaheel">Fahaheel</option>
                    <option value="Farwaniya">Farwaniya</option>
                    <option value="Hawally">Hawally</option>
                    <option value="Jleeb">Jleeb</option>
                    <option value="Salmiya">Salmiya</option>
                  </select>
                </div>

                {/* Follow Up Member */}
                <div>
                  <label htmlFor="follow_up_member" className="block text-sm font-medium text-gray-700">
                    Member for Follow Up
                  </label>
                  <input
                    type="text"
                    name="follow_up_member"
                    id="follow_up_member"
                    value={formData.follow_up_member || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Office Comments */}
                <div>
                  <label htmlFor="office_comments" className="block text-sm font-medium text-gray-700">
                    Comments for Internal Use
                  </label>
                  <textarea
                    name="office_comments"
                    id="office_comments"
                    value={formData.office_comments || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Enter comments"
                  ></textarea>
                </div>


               {/* KWS ID Field */}
{/* KWS ID Field */}
<div>
  <label htmlFor="kwsid" className="block text-sm font-medium text-gray-700">
    KWS ID
  </label>
  <input
    type="text"
    name="kwsid"
    id="kwsid"
    value={formData.kwsid || ""}
    onChange={handleChange}
    className={`mt-1 p-2 block w-full rounded-lg border-2 
      ${kwsidError ? "border-red-500 focus:border-red-500" : "border-gray-300"} 
      shadow-sm focus:ring-blue-500`}
  />
  
  {/* Show error message only if the user has changed the field */}
  {isKwsidChanged && kwsidError && (
    <p className="text-red-500 text-sm mt-1">{kwsidError}</p>
  )}
</div>

              </div>
            </div>
            </div>
            <div className="mt-6">
  <h2 className="text-2xl font-semibold mb-4">Membership Status</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="membership_status" className="block text-sm font-medium text-gray-700">
        Membership Status
      </label>
      <select
        name="membership_status"
        id="membership_status"
        value={formData.membership_status || ""}
        onChange={handleChange}
        className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        // required
      >
        <option value="" disabled>
          Select Status
        </option>
        <option value="approved">Approved</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  </div>
</div>

            {/* Error and Success Messages */}
            {errorMessage && (
              <div className="text-red-500 text-center text-sm mt-4">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-500 text-center text-sm mt-4">{successMessage}</div>
            )}

            {/* Submit Button */}
            <div className="text-center mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Update Member
              </button>
            </div>
          
          </form>
        </div>
      </div>
    );
};

export default EditMember;
