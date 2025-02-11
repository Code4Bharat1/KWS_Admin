"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const Update = () => {
  const [formData, setFormData] = useState({
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

  // Get userId from localStorage (or from your authentication mechanism)
  const userId = typeof window !== "undefined" && localStorage.getItem("userId");
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
        // Set the initial form data
        setFormData(response.data.data);
        setInitialFormData(response.data.data);  // Store initial form data here
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

  // Handle form submission for updating details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");
  
    // Create an object to store only changed data
    const changedData = {};
  
    // Iterate over all fields in the form and compare with initial values
    for (let key in formData) {
      if (formData[key] !== initialFormData[key]) {
        changedData[key] = formData[key]; // Add changed field to the object
      }
    }
  
    // If no data has changed, exit early
    if (Object.keys(changedData).length === 0) {
      setErrorMessage("No changes detected.");
      setIsUpdating(false);
      return;
    }
  
    try {
      const memberId = userId;
      // Send the changed data to the backend to create an update request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/update-request`, // New endpoint
        {
          memberId: memberId,
          formData: changedData, // Send only the changed fields
        }
      );
      setSuccessMessage("Profile update request submitted successfully!");
    } catch (error) {
      console.error("Error submitting update request:", error);
      setErrorMessage("Failed to submit update request. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };
  // If still loading data from API...
  if (isLoading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (errorMessage) {
    return <div className="text-center text-red-500">{errorMessage}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl text-green-700 font-bold text-center mb-8">Update Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-8 space-y-6"
      >
        {/* Personal Details */}
        <div>
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
            {isUpdating ? "Updating..." : "Update"}
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
