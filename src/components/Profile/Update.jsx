"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const Update = () => {
  const [formData, setFormData] = useState({
    profile_picture: "",
    email: "",
    education_qualification: "",
    profession: "",
    kuwait_contact: "",
    kuwait_whatsapp: "",
    marital_status: "",
    family_in_kuwait: "",
    flat_no: "",
    floor_no: "",
    block_no: "",
    building_name_no: "",
    street_no_name: "",
    area: "",
    residence_complete_address: "",
    pin_no_india: "",
    mohalla_village: "",
    taluka: "",
    district: "",
    native_pin_no: "",
    emergency_name_kuwait: "",
    emergency_contact_kuwait: "",
    emergency_name_india: "",
    emergency_contact_india: "",
    father_name: "",
    mother_name: "",
    spouse_name: "",
    child_name_1: "",
    child_name_2: "",
    child_name_3: "",
    child_name_4: "",
    child_name_5: "",
    full_name_1: "",
    relation_1: "",
    percentage_1: "",
    mobile_1: "",
    full_name_2: "",
    relation_2: "",
    percentage_2: "",
    mobile_2: "",
    full_name_3: "",
    relation_3: "",
    percentage_3: "",
    mobile_3: "",
    full_name_4: "",
    relation_4: "",
    percentage_4: "",
    mobile_4: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [file, setFile] = useState(null);

  // Get userId from localStorage (or from your authentication mechanism)
  const userId =
    typeof window !== "undefined" && localStorage.getItem("userId");
  const [initialFormData, setInitialFormData] = useState({});

  // Fetch existing user details on mount
  useEffect(() => {
    if (!userId) {
      setErrorMessage("User ID is not available. Please log in.");
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/get/${userId}`
        );
        // Set both form data and preview
        setFormData(response.data.data);
        setInitialFormData(response.data.data);

        // If profile_picture exists in response, set it as preview
        if (response.data.data.profile_picture) {
          setProfilePicturePreview(response.data.data.profile_picture);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile("");
      setProfilePicturePreview(initialFormData.profile_picture || "");
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedFileTypes.includes(selectedFile.type)) {
      setErrorMessage("Invalid file type. Only JPG/JPEG/PNG allowed.");
      setFile("");
      setProfilePicturePreview(initialFormData.profile_picture || "");
      return;
    }

    if (selectedFile.size > maxSizeInBytes) {
      setErrorMessage("Profile picture exceeds 2MB size limit.");
      setFile("");
      setProfilePicturePreview(initialFormData.profile_picture || "");
      return;
    }

    setFile(selectedFile);
    setProfilePicturePreview(URL.createObjectURL(selectedFile));
    setErrorMessage("");
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("profile_picture", file); // Append the 'file' state

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/updatephoto/${userId}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Refetch user data to update state
      const refetchResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/get/${userId}`
      );
      setFormData(refetchResponse.data.data);
      setInitialFormData(refetchResponse.data.data);
      setProfilePicturePreview(refetchResponse.data.data.profile_picture);

      setSuccessMessage("Profile Photo updated successfully.");
      setFile("");
    } catch (error) {
      console.error("Error updating photo:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update photo."
      );
      setFile("");
      setProfilePicturePreview(initialFormData.profile_picture || "");
    }
  };

  const handleCancle = () => {
    setFile("");
    setProfilePicturePreview(initialFormData.profile_picture || "");
    setErrorMessage("");
  };

  // Handle form submission for updating details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMessage(""); // Reset any error message
    setSuccessMessage(""); // Reset any success message

    // Ensure userId is available in localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setErrorMessage("User not logged in.");
      setIsUpdating(false);
      return; // Prevent further execution if userId is not available
    }

    // Check if there are any pending update requests for this user
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/check/${userId}` // Pass the userId to the backend
      );

      // If there's already a pending request, show an error and stop the form submission
      if (response.data.pending) {
        setErrorMessage(
          "There is already a pending update request for this member."
        );
        setIsUpdating(false);
        return; // Prevent form submission if there's a pending request
      }

      // If there is no pending request, proceed with submitting the form
      const changedData = {};

      // Collect only the changed fields
      for (let key in formData) {
        if (formData[key] !== initialFormData[key]) {
          changedData[key] = formData[key];
        }
      }

      // If no data has changed, exit early
      if (Object.keys(changedData).length === 0) {
        setErrorMessage("No changes detected.");
        setIsUpdating(false);
        return;
      }

      // Proceed with creating an update request if changes are detected
      const updateResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/update-request`,
        {
          memberId: userId,
          formData: changedData, // Send only the changed fields
        }
      );

      setSuccessMessage("Profile update request submitted successfully!");
    } catch (error) {
      console.error("Error submitting update request:", error);

      // Check if the error has a response and display a specific message
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message || "Failed to submit update request."
        );
      } else {
        setErrorMessage(
          "Failed to submit update request. Please try again later."
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl text-green-700 font-bold text-center mb-8">
        Update Profile
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-8 space-y-6"
      >
        {/* Personal Details */}
        <div>
          <div className="flex flex-col items-center p-6 bg-white rounded-xl">
            <label className="text-lg font-medium text-gray-800 mb-2">
              Profile Picture (2MB Max)
            </label>
            <h1 className="mb-4 text-red-500 text-sm text-center">
              Only JPG / JPEG / PNG images are allowed*
            </h1>

            {profilePicturePreview ? (
              <div className="relative group flex flex-col items-center">
                <img
                  src={profilePicturePreview}
                  alt="Current Profile Picture"
                  className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-gray-300"
                />

                <label
                  htmlFor="profilePictureUpload"
                  className="mt-4 flex items-center justify-center w-48 h-12 border-2 border-black rounded-lg cursor-pointer hover:bg-blue-100 transition-all duration-200"
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
              <label
                htmlFor="profilePictureUpload"
                className="mt-4 flex flex-col justify-center items-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-blue-500 transition-all duration-200"
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
                <span className="text-gray-500 text-sm">
                  Upload Profile Picture
                </span>
                <input
                  type="file"
                  id="profilePictureUpload"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            )}

            {/* Conditionally show Save and Cancel buttons */}
            {file && (
              <div className="mt-4 flex gap-4 justify-center">
                <button
                  onClick={handleUploadPhoto}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancle}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold mb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Education Qualification
              </label>
              <input
                type="text"
                name="education_qualification"
                value={formData.education_qualification || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profession
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kuwait Contact
              </label>
              <input
                type="tel"
                name="kuwait_contact"
                value={formData.kuwait_contact || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kuwait WhatsApp
              </label>
              <input
                type="tel"
                name="kuwait_whatsapp"
                value={formData.kuwait_whatsapp || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Marital Status
              </label>
              <select
                name="marital_status"
                value={formData.marital_status || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Family in Kuwait
              </label>
              <select
                name="family_in_kuwait"
                value={formData.family_in_kuwait || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div>
          <h3 className="text-lg font-bold mb-4">Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Flat No.
              </label>
              <input
                type="text"
                name="flat_no"
                value={formData.flat_no || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Floor No.
              </label>
              <input
                type="text"
                name="floor_no"
                value={formData.floor_no || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Block No.
              </label>
              <input
                type="text"
                name="block_no"
                value={formData.block_no || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Building Name/No.
              </label>
              <input
                type="text"
                name="building_name_no"
                value={formData.building_name_no || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street Name/No.
              </label>
              <input
                type="text"
                name="street_no_name"
                value={formData.street_no_name || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Area
              </label>
              <input
                type="text"
                name="area"
                value={formData.area || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Indian Address
              </label>
              <input
                type="text"
                name="residence_complete_address"
                value={formData.residence_complete_address || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                PIN No. (India)
              </label>
              <input
                type="text"
                name="pin_no_india"
                value={formData.pin_no_india || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mohalla/Village
              </label>
              <input
                type="text"
                name="mohalla_village"
                value={formData.mohalla_village || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Taluka
              </label>
              <input
                type="text"
                name="taluka"
                value={formData.taluka || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                name="district"
                value={formData.district || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Native PIN No.
              </label>
              <input
                type="text"
                name="native_pin_no"
                value={formData.native_pin_no || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div>
          <h3 className="text-lg font-bold mb-4">Emergency Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Emergency Name (Kuwait)
              </label>
              <input
                type="text"
                name="emergency_name_kuwait"
                value={formData.emergency_name_kuwait || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact (Kuwait)
              </label>
              <input
                type="text"
                name="emergency_contact_kuwait"
                value={formData.emergency_contact_kuwait || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Emergency Name (India)
              </label>
              <input
                type="text"
                name="emergency_name_india"
                value={formData.emergency_name_india || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact (India)
              </label>
              <input
                type="text"
                name="emergency_contact_india"
                value={formData.emergency_contact_india || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div>
          <h3 className="text-lg font-bold mb-4">Family Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Father's Name
              </label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mother's Name
              </label>
              <input
                type="text"
                name="mother_name"
                value={formData.mother_name || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Spouse's Name
              </label>
              <input
                type="text"
                name="spouse_name"
                value={formData.spouse_name || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            {/* Display Child fields as needed */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Child 1
              </label>
              <input
                type="text"
                name="child_name_1"
                value={formData.child_name_1 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Child 2
              </label>
              <input
                type="text"
                name="child_name_2"
                value={formData.child_name_2 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Child 3
              </label>
              <input
                type="text"
                name="child_name_3"
                value={formData.child_name_3 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Child 4
              </label>
              <input
                type="text"
                name="child_name_4"
                value={formData.child_name_4 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Child 5
              </label>
              <input
                type="text"
                name="child_name_5"
                value={formData.child_name_5 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">MBS Nomination</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 1 Name
              </label>
              <input
                type="text"
                name="full_name_1"
                value={formData.full_name_1 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 1 Relationship
              </label>
              <input
                type="text"
                name="relation_1"
                value={formData.relation_1 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 1 Percentage
              </label>
              <input
                type="number"
                name="percentage_1"
                value={formData.percentage_1 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 1 Contact
              </label>
              <input
                type="tel"
                name="mobile_1"
                value={formData.mobile_1 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 2 Name
              </label>
              <input
                type="text"
                name="full_name_2"
                value={formData.full_name_2 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 2 Relationship
              </label>
              <input
                type="text"
                name="relation_2"
                value={formData.relation_2 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 2 Percentage
              </label>
              <input
                type="number"
                name="percentage_2"
                value={formData.percentage_2 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 2 Contact
              </label>
              <input
                type="tel"
                name="mobile_2"
                value={formData.mobile_2 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 3 Name
              </label>
              <input
                type="text"
                name="full_name_3"
                value={formData.full_name_3 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 3 Relationship
              </label>
              <input
                type="text"
                name="relation_3"
                value={formData.relation_3 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 3 Percentage
              </label>
              <input
                type="number"
                name="percentage_3"
                value={formData.percentage_3 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 3 Contact
              </label>
              <input
                type="tel"
                name="mobile_3"
                value={formData.mobile_3 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 4 Name
              </label>
              <input
                type="text"
                name="full_name_4"
                value={formData.full_name_4 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 4 Relationship
              </label>
              <input
                type="text"
                name="relation_4"
                value={formData.relation_4 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 4 Percentage
              </label>
              <input
                type="number"
                name="percentage_4"
                value={formData.percentage_4 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominee 4 Contact
              </label>
              <input
                type="tel"
                name="mobile_4"
                value={formData.mobile_4 || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-500 text-center">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-600 text-center">{successMessage}</div>
        )}

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isUpdating ? "Submitting..." : " Submit Update Request"}
          </button>
        </div>
      </form>

      {/* Back Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Update;
