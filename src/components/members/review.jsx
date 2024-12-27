"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Review = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);


// Function to handle adding images
const handleImageChange = (e) => {
  const file = e.target.files[0]; // Only pick the first file
  const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

  if (file) {
    if (file.size > maxSizeInBytes) {
      setErrorMessage(`File ${file.name} exceeds the 2MB size limit.`);
      return;
    }

    // Update the scanned form with the file object
    setFormData((prevData) => ({
      ...prevData,
      form_scanned: file, // Save only a single file
    }));
    setErrorMessage(""); // Clear any previous error message
  }
};
// Function to handle removing images
const handleRemoveImage = (indexToRemove) => {
  setFormData((prevData) => ({
    ...prevData,
    form_scanned: prevData.form_scanned.filter((_, index) => index !== indexToRemove),
  }));
};


  
  // Fetch all users with membership status "pending"
  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        const response = await axios.get("http://localhost:5786/api/member/pending");
        setPendingApprovals(response.data); // Store fetched pending approvals in state
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
        setErrorMessage("Error fetching pending approvals.");
      }
    };

    fetchPendingApprovals();
  }, []);

  // Handle selecting a user for review
  const handleReviewClick = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5786/api/auth/get/${userId}`);
      const userData = response.data;
      if (userData.dob) {
        userData.dob = new Date(userData.dob).toISOString().split("T")[0]; // Ensure correct format
      }
      setSelectedUser(response.data);
      setFormData(response.data); // Pre-fill the form with selected user data
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Error fetching user data.");
    }
  };

  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle approval or rejection
  const handleApproval = async (status) => {
    try {
      const formDataToSend = new FormData();
  
      // Append all form fields except files
      for (const key in formData) {
        if (key === "form_scanned" && formData[key]) {
          // If form_scanned is a single file
          formDataToSend.append("form_scanned", formData[key]);
        } else if (key === "profile_picture" && formData[key]) {
          // Append profile_picture file
          formDataToSend.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== "") {
          // Append other non-file fields
          formDataToSend.append(key, formData[key]);
        }
      }
      // Set membership_status, ensuring it overwrites any previous entry
      formDataToSend.set("membership_status", status); // Use .set to overwrite existing values
  
      console.log("Membership status being sent:", status); // Debug log
      console.log("FormData to be sent:", Array.from(formDataToSend.entries())); // Debug log
  
      const response = await axios.put(
        `http://localhost:5786/api/member/update/${formData.user_id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Update response:", response.data);
  
      // Reset state and fetch updated data
      setSelectedUser(null);
      setFormData({});
      const responsePending = await axios.get("http://localhost:5786/api/member/pending");
      setPendingApprovals(responsePending.data);
    } catch (error) {
      console.error("Error updating approval status:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "An error occurred while updating the status.");
    }
  };
  // Function to format the applied date (showing only the date)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format as 'MM/DD/YYYY'
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
  
    if (file) {
      if (file.size > maxSizeInBytes) {
        setErrorMessage(`Profile picture exceeds the 2MB size limit.`);
        return;
      }
  
      // Update the profile_picture with the file object and store preview locally (not sent to backend)
      setFormData((prevData) => ({
        ...prevData,
        profile_picture: file, // File to be sent to the backend
      }));
  
      // Set a local state for previewing the image
      setProfilePicturePreview(URL.createObjectURL(file)); // This will be used only for display
      setErrorMessage(""); // Clear any previous error message
    }
  };
  

  // Remove profile picture
  const handleRemoveProfilePicture = () => {
    setFormData({ ...formData, profile_picture: null });
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Pending Approvals
      </h1>

      {/* List Section */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="text-left bg-gray-200">
            <tr>
              <th className="px-4 py-4">Applied Date</th>
              <th className="px-4 py-4">Civil ID</th>
              <th className="px-4 py-4">First Name</th>
              <th className="px-4 py-4">Last Name</th>
              <th className="px-4 py-4">Review</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {pendingApprovals.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-4">{formatDate(item.application_date)}</td>
                <td className="px-4 py-4">{item.civil_id}</td>
                <td className="px-4 py-4">{item.first_name}</td>
                <td className="px-4 py-4">{item.last_name}</td>
                <td className="px-4 py-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 underline"
                    onClick={() => handleReviewClick(item.user_id)} 
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Review Form */}
      {selectedUser && (
        <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl text-green-900 font-bold text-center mb-4">
            Review User - {selectedUser.first_name} {selectedUser.last_name}
          </h2>
          <form>
            {/* Personal Details Section */}
            <div className="mt-12">
              <h3 className="text-2xl text-gray-800 font-semibold mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    
                  />
                </div>

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
                  />
                </div>

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
                  />
                </div>

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
                  />
                </div>

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
  <label className="text-lg font-medium text-gray-800 mb-4">Profile Picture</label>
  {profilePicturePreview ? (
    <div className="relative group">
      <img
        src={profilePicturePreview}
        alt="Profile Preview"
        className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-gray-300"
      />
      <button
        type="button"
        onClick={() => {
          setFormData((prevData) => ({ ...prevData, profile_picture: null }));
          setProfilePicturePreview(null);
        }}
        className="absolute top-2 right-2 bg-red-600 text-white text-sm p-1 rounded-full shadow-md hover:bg-red-700 transition-all duration-200"
      >
        &times;
      </button>
    </div>
  ) : (
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
        onChange={handleProfilePictureChange}
        className="hidden"
      />
    </label>
  )}
</div>

<h3 className="text-2xl text-gray-800 font-semibold mb-4">Address (Kuwait)</h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div>
                  <label htmlFor="flat_no" className="block text-sm font-medium text-gray-700">
                    Flat No
                  </label>
                  <input
                    type="text"
                    name="flat_no"
                    id="flat_no"
                    value={formData.flat_no|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="floor_no" className="block text-sm font-medium text-gray-700">
                  Floor No
                  </label>
                  <input
                    type="text"
                    name="floor_no"
                    id="floor_no"
                    value={formData.floor_no|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="block_no" className="block text-sm font-medium text-gray-700">
                  Block No
                  </label>
                  <input
                    type="text"
                    name="block_no"
                    id="block_no"
                    value={formData.block_no|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="building_name_no" className="block text-sm font-medium text-gray-700">
                  Building Name No
                  </label>
                  <input
                    type="text"
                    name="building_name_no"
                    id="building_name_no"
                    value={formData.building_name_no|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="street_no_name" className="block text-sm font-medium text-gray-700">
                  Street  Name No.
                  </label>
                  <input
                    type="text"
                    name="street_no_name"
                    id="street_no_name"
                    value={formData.street_no_name|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                  Area
                  </label>
                  <input
                    type="text"
                    name="area"
                    id="area"
                    value={formData.area|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

</div>
<div className="mb-6">
<h3 className="text-2xl mt-2 text-gray-800 font-semibold mb-4">Address (India)</h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div>
                  <label htmlFor="indianAddress" className="block text-sm font-medium text-gray-700">
                  Complete Indian Address
                  </label>
                  <input
                    type="text"
                    name="indianAddress"
                    id="indianAddress"
                    value={formData.indianAddress|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="pin_no_india" className="block text-sm font-medium text-gray-700">
                  PIN No.
                  </label>
                  <input
                    type="text"
                    name="pin_no_india"
                    id="pin_no_india"
                    value={formData.pin_no_india|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                </div>


                <h3 className="text-2xl mt-2  text-gray-800 font-semibold mb-4">Address (Permanent Native)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="mohalla_village" className="block text-sm font-medium text-gray-700">
                  Mohalla or Village
                  </label>
                  <input
                    type="text"
                    name="mohalla_village"
                    id="mohalla_village"
                    value={formData.mohalla_village|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="taluka" className="block text-sm font-medium text-gray-700">
                  Taluka
                  </label>
                  <input
                    type="text"
                    name="taluka"
                    id="taluka"
                    value={formData.taluka|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  District
                  </label>
                  <input
                    type="text"
                    name="district"
                    id="district"
                    value={formData.district|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="native_pin_no" className="block text-sm font-medium text-gray-700">
                  Native PIN No.
                  </label>
                  <input
                    type="text"
                    name="native_pin_no"
                    id="native_pin_no"
                    value={formData.native_pin_no|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                  </div>



                  <div className="mb-6">
<h3 className="text-2xl mt-2 text-gray-800 font-semibold mb-4">Contact Numbers (India)</h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div>
                  <label htmlFor="indian_contact_no_1" className="block text-sm font-medium text-gray-700">
                  Indian Contact No. 1
                  </label>
                  <input
                    type="text"
                    name="indian_contact_no_1"
                    id="indian_contact_no_1"
                    value={formData.indian_contact_no_1|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                

                <div>
                  <label htmlFor="indian_contact_no_2" className="block text-sm font-medium text-gray-700">
                  Indian Contact No. 2
                  </label>
                  <input
                    type="text"
                    name="indian_contact_no_2"
                    id="indian_contact_no_2"
                    value={formData.indian_contact_no_2|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="indian_contact_no_3" className="block text-sm font-medium text-gray-700">
                  Indian Contact No. 3
                  </label>
                  <input
                    type="text"
                    name="indian_contact_no_3"
                    id="indian_contact_no_3"
                    value={formData.indian_contact_no_3|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
  </div>

  
                  </div>

                  <div className="mb-6">
<h3 className="text-2xl mt-2 text-gray-800 font-semibold mb-4">Emergency contact (Kuwait)</h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div>
                  <label htmlFor="emergency_name_kuwait" className="block text-sm font-medium text-gray-700">
                  Emergency Name (Kuwait)
                  </label>
                  <input
                    type="text"
                    name="emergency_name_kuwait"
                    id="emergency_name_kuwait"
                    value={formData.emergency_name_kuwait|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                

                <div>
                  <label htmlFor="emergency_contact_kuwait" className="block text-sm font-medium text-gray-700">
                  Emergency Contact (Kuwait)
                  </label>
                  <input
                    type="text"
                    name="emergency_contact_kuwait"
                    id="emergency_contact_kuwait"
                    value={formData.emergency_contact_kuwait|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                    
  </div>

  
                  </div>

                  <div className="mb-6">
                  <h3 className="text-2xl mt-2 text-gray-800 font-semibold mb-4">Emergency contact (India)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                  <label htmlFor="emergency_name_india" className="block text-sm font-medium text-gray-700">
                  Emergency Name (India)
                  </label>
                  <input
                    type="text"
                    name="emergency_name_india"
                    id="emergency_name_india"
                    value={formData.emergency_name_india|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="emergency_contact_india" className="block text-sm font-medium text-gray-700">
                  Emergency Contact (India)
                  </label>
                  <input
                    type="text"
                    name="emergency_contact_india"
                    id="emergency_contact_india"
                    value={formData.emergency_contact_india|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
</div>
                  </div>


                  <div className="mb-6">
                  <h3 className="text-2xl mt-2 text-gray-800 font-semibold mb-4">Family</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                  <label htmlFor="father_name" className="block text-sm font-medium text-gray-700">
                  Father's Name
                  </label>
                  <input
                    type="text"
                    name="father_name"
                    id="father_name"
                    value={formData.father_name|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="mother_name" className="block text-sm font-medium text-gray-700">
                  Mother's Name
                  </label>
                  <input
                    type="text"
                    name="mother_name"
                    id="mother_name"
                    value={formData.mother_name|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>


                <div>
                  <label htmlFor="spouse_name" className="block text-sm font-medium text-gray-700">
                  Spouse's Name
                  </label>
                  <input
                    type="text"
                    name="spouse_name"
                    id="spouse_name"
                    value={formData.spouse_name|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>


                <div>
                  <label htmlFor="child_name_1" className="block text-sm font-medium text-gray-700">
                  Name of First Child
                  </label>
                  <input
                    type="text"
                    name="child_name_1"
                    id="child_name_1"
                    value={formData.child_name_1|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="child_name_2" className="block text-sm font-medium text-gray-700">
                  Name of Second Child
                  </label>
                  <input
                    type="text"
                    name="child_name_2"
                    id="child_name_2"
                    value={formData.child_name_2|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="child_name_3" className="block text-sm font-medium text-gray-700">
                  Name of Third Child
                  </label>
                  <input
                    type="text"
                    name="child_name_3"
                    id="child_name_3"
                    value={formData.child_name_3|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="child_name_4" className="block text-sm font-medium text-gray-700">
                  Name of Fourth Child
                  </label>
                  <input
                    type="text"
                    name="child_name_4"
                    id="child_name_4"
                    value={formData.child_name_4|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="child_name_5" className="block text-sm font-medium text-gray-700">
                  Name of Fifth Child
                  </label>
                  <input
                    type="text"
                    name="child_name_5"
                    id="child_name_5"
                    value={formData.child_name_5|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                    </div>
                  </div>

                  <div className="mb-6">
                  <h3 className="text-2xl mt-2 text-gray-800 font-semibold mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                  <label htmlFor="additional_information" className="block text-sm font-medium text-gray-700">
                  Any additional information to pass to KWS on registration
                  </label>
                  <input
                    type="text"
                    name="additional_information"
                    id="additional_information"
                    value={formData.additional_information|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

</div>
                  </div>

                  <div className="mb-6">
                  <h3 className="text-2xl mt-2 text-gray-800 font-semibold mb-4">MBS Nomination</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                  <label htmlFor="full_name_1" className="block text-sm font-medium text-gray-700">
                  Name of First MBS Nominee
                  </label>
                  <input
                    type="text"
                    name="full_name_1"
                    id="full_name_1"
                    value={formData.full_name_1|| ""}
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
                    value={formData.relation_1|| ""}
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
                    value={formData.percentage_1|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    value={formData.mobile_1|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300  shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>


</div>
                  </div>


                  <div className="mb-6 ">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                  <label htmlFor="full_name_2" className="block text-sm font-medium text-gray-700">
                  Name of Second MBS Nominee
                  </label>
                  <input
                    type="text"
                    name="full_name_2"
                    id="full_name_2"
                    value={formData.full_name_2|| ""}
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
                    value={formData.relation_2|| ""}
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
                    value={formData.percentage_2|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    value={formData.mobile_2|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>


</div>
                  </div>


                  
                  <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                  <label htmlFor="full_name_3" className="block text-sm font-medium text-gray-700">
                  Name of Third MBS Nominee
                  </label>
                  <input
                    type="text"
                    name="full_name_3"
                    id="full_name_3"
                    value={formData.full_name_3|| ""}
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
                    value={formData.relation_3|| ""}
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
                    value={formData.percentage_3|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    value={formData.mobile_3|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>


</div>
                  </div>


                  
                  <div className="mb-6 border-b-4 border-black">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                  <label htmlFor="full_name_4" className="block text-sm font-medium text-gray-700">
                  Name of Fourth MBS Nominee
                  </label>
                  <input
                    type="text"
                    name="full_name_4"
                    id="full_name_4"
                    value={formData.full_name_4|| ""}
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
                    value={formData.relation_4|| ""}
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
                    value={formData.percentage_4|| ""}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    value={formData.mobile_4|| ""}
                    onChange={handleChange}
                    className="mt-1 mb-8 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>


</div>
                  </div>

                  <div className="mb-6">
  <h3 className="text-4xl mb-4 text-center border-b-4 border-black">Office Use</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Application Date (Printed Only) */}
    <div>
  <label htmlFor="application_date" className="block text-sm font-medium text-gray-700">
    Application Date
  </label>
  <p className="text-gray-900">
    {formData.application_date
      ? new Date(formData.application_date).toLocaleDateString("en-US") // Format to date only
      : "N/A"}
  </p>
</div>


    {/* Type of Member Dropdown */}
    <div>
  <label htmlFor="type_of_member" className="block text-sm font-medium text-gray-700">
    Type of Member
  </label>
  <select
    name="type_of_member"
    id="type_of_member"
    value={formData.type_of_member || ""}
    onChange={handleChange}
    className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
  >
    <option value="" disabled>Select</option>
    <option value="PRIVILEGE MEMBER">PRIVILEGE MEMBER</option>
    <option value="ADVISOR">ADVISOR</option>
    <option value="CC MEMBER">CC MEMBER</option>
    <option value="DONORS">DONORS</option>
    <option value="EC MEMBER">EC MEMBER</option>
    <option value="ELITeE MEMBER">ELITE MEMBER</option>
    <option value="EX OFFICIO PRESIDENT">EX OFFICIO PRESIDENT</option>
    <option value="GENERAL SECRETARY">GENERAL SECRETARY</option>
    <option value="JOINT GENERAL SECRETARY">JOINT GENERAL SECRETARY</option>
    <option value="JOINT TREASURER">JOINT TREASURER</option>
    <option value="LADIES EC MEMBER">LADIES EC MEMBER</option>
    <option value="PATRON">PATRON</option>
    <option value="PRESIDENT">PRESIDENT</option>
    <option value="TREASURER">TREASURER</option>
    <option value="VENDORS">VENDORS</option>
    <option value="VICE PRESIDENT">VICE PRESIDENT</option>
    <option value="VC MEMBER">VC MEMBER</option>
    <option value="LADIES CC MEMBER">LADIES CC MEMBER</option>
    <option value="LADIES VC MEMBER">LADIES VC MEMBER</option>
    <option value="LADIES ELITE MEMBER">LADIES ELITE MEMBER</option>
    <option value="LADIES PRIVILEGE MEMBER">LADIES PRIVILEGE MEMBER</option>
  </select>
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
        <option value="" disabled>Select</option>
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

    {/* Form Scanned */}
{/* Form Scanned */}
<div>
  <label htmlFor="form_scanned" className="block text-sm font-medium text-gray-700">
    Upload a scanned copy of the physical KWS form (old members)
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
      src={URL.createObjectURL(formData.form_scanned)} // Use only if it's a File
      alt="Scanned Form"
      className="w-full h-auto rounded-lg border"
    />
    <button
      type="button"
      onClick={() => setFormData((prevData) => ({ ...prevData, form_scanned: null }))}
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
        <option value="" disabled>Select</option>
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
        <option value="" disabled>Select</option>
        <option value="fahaheel">Fahaheel</option>
        <option value="farwaniya">Farwaniya</option>
        <option value="hawally">Hawally</option>
        <option value="jleeb">Jleeb</option>
        <option value="salmiya">Salmiya</option>
      </select>
    </div>

    {/* Follow Up Member */}
    <div>
      <label htmlFor="follow_up_member" className="block text-sm font-medium text-gray-700">
      Member for follow up
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
  </div>
</div>

</div>
            {/* Error message */}
            {errorMessage && (
              <div className="text-red-500 text-center text-sm mt-4">{errorMessage}</div>
            )}

            {/* Approval/Reject Buttons */}
            <div className="text-center mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-4"
                onClick={() => handleApproval("approved")}
              >
                Approve
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => handleApproval("rejected")}
              >
                Reject
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Review;
