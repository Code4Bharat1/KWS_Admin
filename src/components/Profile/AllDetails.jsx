"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const AllDetails = () => {
  const [formData, setFormData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve userId from localStorage
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setErrorMessage("User ID is not available. Please log in.");
      setIsLoading(false);
      return;
    }

    const fetchFormData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/get/${userId}`);
        setFormData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, []);

  if (isLoading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (errorMessage) {
    return <div className="text-center text-red-500">{errorMessage}</div>;
  }

  const displayField = (label, value) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="bg-gray-100 p-2 rounded">{value || "N/A"}</p>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8">Member Details</h2>
      <div className="bg-white shadow rounded p-8">
        {/* Personal Details */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayField("Civil ID", formData.civil_id)}
            {displayField("First Name", formData.first_name)}
            {displayField("Middle Name", formData.middle_name)}
            {displayField("Last Name", formData.last_name)}
            {displayField("Membership Type", formData.type_of_member)}
            {displayField("Card Expiry", new Date(formData.card_expiry_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
}))}
            {displayField("Email", formData.email)}
            {displayField("Date of Birth", new Date(formData.dob).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
}))}
            {displayField("Gender", formData.gender)}
            {displayField("Blood Group", formData.blood_group)}
            {displayField("Education Qualification", formData.education_qualification)}
            {displayField("Profession", formData.profession)}
            {displayField("Kuwait Contact", formData.kuwait_contact)}
            {displayField("Kuwait WhatsApp", formData.kuwait_whatsapp)}
            {displayField("Marital Status", formData.marital_status)}
            {displayField("Family in Kuwait", formData.family_in_kuwait)}
          </div>
        </div>

        {/* Address Details */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayField("Flat No.", formData.flat_no)}
            {displayField("Floor No.", formData.floor_no)}
            {displayField("Block No.", formData.block_no)}
            {displayField("Building Name/No.", formData.building_name_no)}
            {displayField("Street Name/No.", formData.street_no_name)}
            {displayField("Area", formData.area)}
            {displayField("Indian Address", formData.residence_complete_address)}
            {displayField("PIN No. (India)", formData.pin_no_india)}
            {displayField("Mohalla/Village", formData.mohalla_village)}
            {displayField("Taluka", formData.taluka)}
            {displayField("District", formData.district)}
            {displayField("Native PIN No.", formData.native_pin_no)}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Emergency Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayField("Emergency Name (Kuwait)", formData.emergency_name_kuwait)}
            {displayField("Emergency Contact (Kuwait)", formData.emergency_contact_kuwait)}
            {displayField("Emergency Name (India)", formData.emergency_name_india)}
            {displayField("Emergency Contact (India)", formData.emergency_contact_india)}
          </div>
        </div>

        {/* Family Information */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Family Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayField("Father's Name", formData.father_name)}
            {displayField("Mother's Name", formData.mother_name)}
            {displayField("Spouse's Name", formData.spouse_name)}
            {displayField("Child 1", formData.child_name_1)}
            {displayField("Child 2", formData.child_name_2)}
            {displayField("Child 3", formData.child_name_3)}
            {displayField("Child 4", formData.child_name_4)}
            {displayField("Child 5", formData.child_name_5)}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Additional Information</h3>
          {displayField("Additional Information", formData.additional_information)}
        </div>

        {/* MBS Nomination */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">MBS Nomination</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayField("Nominee 1 Name", formData.full_name_1)}
            {displayField("Nominee 1 Relationship", formData.relation_1)}
            {displayField("Nominee 1 Percentage", formData.percentage_1)}
            {displayField("Nominee 1 Contact", formData.mobile_1)}
            {displayField("Nominee 2 Name", formData.full_name_2)}
            {displayField("Nominee 2 Relationship", formData.relation_2)}
            {displayField("Nominee 2 Percentage", formData.percentage_2)}
            {displayField("Nominee 2 Contact", formData.mobile_2)}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllDetails;
