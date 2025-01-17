"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const AddNonKws = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Initialize react-hook-form with default values
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      isCompany: "no",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "male",
      maritalStatus: "",
      familyInKuwait: "",
      contact: "",
      whatsapp: "",
      email: "",
      zoneMember: "NA",
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
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // console.log("Form Data:", data);

      // Send the form data to the backend using Axios
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/nonkws/addnonkws`,
        data
      );

      // Handle the response if the data is successfully added
      // console.log("Backend Response:", response.data);

      // Optional: Redirect to another page or show success message
      alert("Non-KWS member added successfully!");

      // Reset the form and go back to the first step
      setStep(1);
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("An error occurred while adding the Non-KWS member");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navigation to the next step with validation
  const nextStep = async () => {
    const isValid = await trigger(getFieldsForStep(step));
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  // Handle navigation to the previous step
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Helper function to get field names for the current step
  const getFieldsForStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return [
          "isCompany",
          "firstName",
          "lastName",
          "zoneMember",
          "bloodGroup",
          "educationQualification",
          "profession",
          "relationToKws",
          "middleName",
          "gender",
          "maritalStatus",
          "familyInKuwait",
        ];
      case 2:
        return ["contact", "email"];
      case 3:
        return [];
      default:
        return [];
    }
  };

  // Handle confirmation popup for submission
  const handleFinalSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setShowConfirmation(false);
    handleSubmit(onSubmit)();  // Submit the form after confirmation
  };

  const cancelSubmission = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-6 text-center text-green-800">
          Create Non-KWS Member Account
        </h1>

        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              onClick={() => setStep(stepNum)}
              className={`w-1/3 text-center py-2 cursor-pointer rounded-md ${
                step === stepNum
                  ? "bg-green-600 text-white"
                  : "bg-green-200 text-green-600"
              }`}
            >
              {stepNum === 1
                ? "General"
                : stepNum === 2
                ? "Contact"
                : "Address"}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          {/* Step 1: General Info */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl mb-4 text-green-600">General Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Is Company */}
                <div>
                  <label className="block mb-2 text-green-600">Is Company</label>
                  <Controller
                    name="isCompany"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="border p-2 w-full rounded-md"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    )}
                  />
                  {errors.isCompany && (
                    <span className="text-red-500">{errors.isCompany.message}</span>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <label className="block mb-2 text-green-600">First Name*</label>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter First Name"
                      />
                    )}
                  />
                  {errors.firstName && (
                    <span className="text-red-500">{errors.firstName.message}</span>
                  )}
                </div>

                {/* Middle Name */}
                <div>
                  <label className="block mb-2 text-green-600">Middle Name</label>
                  <Controller
                    name="middleName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Middle Name"
                      />
                    )}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block mb-2 text-green-600">Last Name*</label>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Last Name"
                      />
                    )}
                  />
                  {errors.lastName && (
                    <span className="text-red-500">{errors.lastName.message}</span>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block mb-2 text-green-600">Gender</label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="border p-2 w-full rounded-md">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    )}
                  />
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block mb-2 text-green-600">Marital Status</label>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Marital Status"
                      />
                    )}
                  />
                </div>

                {/* Family in Kuwait */}
                <div>
                  <label className="block mb-2 text-green-600">Family in Kuwait</label>
                  <Controller
                    name="familyInKuwait"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Family in Kuwait"
                      />
                    )}
                  />
                </div>

                {/* Zone Member */}
                <div>
                  <label className="block mb-2 text-green-600">Zone Member</label>
                  <Controller
                    name="zoneMember"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="border p-2 w-full rounded-md"
                      >
                        <option value="NA">NA</option>
                        <option value="Fahaheel">Fahaheel</option>
                        <option value="Farwaniya">Farwaniya</option>
                        <option value="Salmiya">Salmiya</option>
                        <option value="Jleeb">Jleeb</option>
                        <option value="Hawally">Hawally</option>
                      </select>
                    )}
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block mb-2 text-green-600">Blood Group</label>
                  <Controller
                    name="bloodGroup"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="border p-2 w-full rounded-md"
                      >
                        <option value="">----</option>
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
                    )}
                  />
                </div>

                {/* Education Qualification */}
                <div>
                  <label className="block mb-2 text-green-600">Education Qualification</label>
                  <Controller
                    name="educationQualification"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Education Qualification"
                      />
                    )}
                  />
                </div>

                {/* Profession */}
                <div>
                  <label className="block mb-2 text-green-600">Profession</label>
                  <Controller
                    name="profession"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Profession"
                      />
                    )}
                  />
                </div>

                {/* Relation to KWS */}
                <div>
                  <label className="block mb-2 text-green-600">Relation to KWS</label>
                  <Controller
                    name="relationToKws"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Relation to KWS"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl mb-4 text-green-600">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact */}
                <div>
                  <label className="block mb-2 text-green-600">Contact*</label>
                  <Controller
                    name="contact"
                    control={control}
                    rules={{ required: "Contact number is required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        className="border p-2 w-full rounded-md"
                        placeholder="Prefix with +int code"
                      />
                    )}
                  />
                  {errors.contact && (
                    <span className="text-red-500">{errors.contact.message}</span>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block mb-2 text-green-600">WhatsApp</label>
                  <Controller
                    name="whatsapp"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        className="border p-2 w-full rounded-md"
                        placeholder="Prefix with +int code"
                      />
                    )}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block mb-2 text-green-600">Email Address</label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Email Address"
                      />
                    )}
                  />
                  {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address Info */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl mb-4 text-green-600">Address Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Flat No. */}
                <div>
                  <label className="block mb-2 text-green-600">Flat No.</label>
                  <Controller
                    name="flatNo"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Flat No."
                      />
                    )}
                  />
                </div>

                {/* Floor No. */}
                <div>
                  <label className="block mb-2 text-green-600">Floor No.</label>
                  <Controller
                    name="floorNo"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Floor No."
                      />
                    )}
                  />
                </div>

                {/* Block No. */}
                <div>
                  <label className="block mb-2 text-green-600">Block No.</label>
                  <Controller
                    name="blockNo"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Block No."
                      />
                    )}
                  />
                </div>

                {/* Building Name No. */}
                <div>
                  <label className="block mb-2 text-green-600">
                    Building Name No.
                  </label>
                  <Controller
                    name="buildingNameNo"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Building Name No."
                      />
                    )}
                  />
                </div>

                {/* Street Name No. */}
                <div>
                  <label className="block mb-2 text-green-600">
                    Street Name No.
                  </label>
                  <Controller
                    name="streetNameNo"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Street Name No."
                      />
                    )}
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="block mb-2 text-green-600">Area</label>
                  <Controller
                    name="area"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="border p-2 w-full rounded-md"
                        placeholder="Enter Area"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button" // Ensure it's type "button" to prevent form submission
                onClick={nextStep}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={isLoading}
              >
                Next
              </button>
            ) : (
              <div className="flex justify-center w-full mt-4">
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className={`px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Confirmation Popup */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold text-center mb-4">
                Are you sure you want to submit?
              </h3>
              <div className="flex justify-between">
                <button
                  onClick={confirmSubmission}
                  className="bg-green-600 text-white py-2 px-4 rounded"
                >
                  Yes
                </button>
                <button
                  onClick={cancelSubmission}
                  className="bg-gray-300 text-black py-2 px-4 rounded"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNonKws;
