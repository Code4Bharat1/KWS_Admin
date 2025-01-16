"use client";

import React, { useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import axios from "axios";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize react-hook-form methods
  const methods = useForm({
    mode: "onTouched",
  });
  const { register, trigger, getValues, handleSubmit, formState } = methods;
  const { errors } = formState;
  const totalSteps = 4;

  // Watch values for dynamic fields
  const numberOfNominations = useWatch({
    control: methods.control,
    name: "numberOfNominations",
    defaultValue: "1",
  });

  // Watch gender to conditionally render the profile picture field
  const gender = useWatch({
    control: methods.control,
    name: "gender",
    defaultValue: "",
  });

  // Define required (asterisk-marked) field names for each step
  const requiredFieldsByStep = {
    1: ["acceptDisclaimer"],
    2: [
      "civil_id",
      "first_name",
      "last_name",
      "email",
      "password",
      "confirmPassword",
      "dob",
      "blood_group",
      "kuwait_contact",
      "kuwait_whatsapp",
      "gender",
      // profilePicture is not required by default, so it is not added here.
    ],
    3: [
      "block_no",
      "area",
      "pin_no_india",
      "native_pin_no",
      "indian_contact_no_1",
      "emergency_name_kuwait",
      "emergency_contact_kuwait",
      "emergency_name_india",
      "emergency_contact_india",
    ],
    4: [
      "numberOfNominations",
      "reviewInfo",
      // nominee fields will be appended dynamically below
    ],
  };

  // Handler for moving to the next step
  const handleNext = async () => {
    let fieldsToValidate = requiredFieldsByStep[currentStep] || [];

    // For step 2, ensure that password and confirmPassword match
    if (currentStep === 2) {
      const password = getValues("password");
      const confirmPassword = getValues("confirmPassword");
      if (password !== confirmPassword) {
        methods.setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match.",
        });
        return;
      }
    }

    // For step 4, add dynamic nominee fields for validation based on numberOfNominations
    if (currentStep === 4) {
      const nNominees = parseInt(getValues("numberOfNominations"), 10) || 0;
      for (let i = 1; i <= nNominees; i++) {
        fieldsToValidate = [
          ...fieldsToValidate,
          `full_name_${i}`,
          `relation_${i}`,
          `percentage_${i}`,
          `mobile_${i}`,
        ];
      }
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  // Handler to go back to the previous step
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // On final form submission, open the confirmation modal
  const onSubmit = (data) => {
    setFormData(data);
    setIsModalOpen(true);
  };

  // Confirm final submission to backend
  const handleConfirmSubmit = async () => {
    setIsLoading(true);
    // console.log("Form data being submitted:", formData);
    try {
      // For a file upload, you might need to use FormData here.
      const response = await axios.post(
        "http://localhost:5786/api/auth/register",
        formData
      );
      // console.log("Response from backend:", response.data);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubmit = () => {
    setIsModalOpen(false);
  };

  // Step titles for the stepper
  const stepTitles = [
    "Disclaimer",
    "Personal Details",
    "Address & Contacts",
    "Family & MBS Nomination",
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="/register.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black opacity-5"></div>

      {/* Content */}
      <div className="relative flex justify-center items-center min-h-screen p-4">
        <div className="bg-white shadow-lg rounded-lg w-full md:w-4/5 lg:w-2/3 xl:w-1/2 p-8 relative z-10">
          {/* Stepper */}
          <div className="flex justify-between mb-8">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-sm font-medium text-center text-gray-700">
                  {title}
                </span>
                {index < stepTitles.length && (
                  <div
                    className={`w-8 h-1 mt-2 ${
                      currentStep > index + 1 ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Form Header */}
          <div className="flex flex-col md:flex-row items-center mb-8">
            {/* Logo Section */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-start mb-4 md:mb-0">
              <img src="/kws.png" alt="Logo" className="w-36 h-28 object-contain" />
            </div>

            {/* Header Section */}
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h2 className="text-3xl text-blue-500 font-syne font-bold">
                KWSKW Register
              </h2>
            </div>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Disclaimer */}
              {currentStep === 1 && (
                <div>
                  <p className="text-gray-600 mb-4 text-center">
                    Please read the following document carefully before proceeding.
                  </p>
                  <div className="mb-6">
                    {/* PDF Viewer */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden h-[400px] md:h-[600px]">
                      <iframe
                        src="/disclaimer2.pdf#toolbar=0&view=FitH"
                        title="Disclaimer"
                        className="w-full h-full"
                        frameBorder="0"
                      ></iframe>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register("acceptDisclaimer", {
                          required: "You must accept the disclaimer.",
                        })}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-700">
                        I agree to the disclaimer
                      </span>
                    </label>
                    {errors.acceptDisclaimer && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.acceptDisclaimer.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        label: "Civil ID*",
                        name: "civil_id",
                        type: "text",
                        validation: { required: "Civil ID is required." },
                      },
                      {
                        label: "First Name*",
                        name: "first_name",
                        type: "text",
                        validation: { required: "First Name is required." },
                      },
                      { label: "Middle Name", name: "middle_name", type: "text" },
                      {
                        label: "Last Name*",
                        name: "last_name",
                        type: "text",
                        validation: { required: "Last Name is required." },
                      },
                      {
                        label: "Email Address*",
                        name: "email",
                        type: "email",
                        validation: {
                          required: "Email is required.",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format.",
                          },
                        },
                      },
                      {
                        label: "Password*",
                        name: "password",
                        type: "password",
                        validation: {
                          required: "Password is required.",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters long.",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message:
                              "Password must include uppercase, lowercase, number, and special character.",
                          },
                        },
                      },
                      {
                        label: "Confirm Password*",
                        name: "confirmPassword",
                        type: "password",
                        validation: {
                          required: "Confirm password is required.",
                          validate: (value) =>
                            value === getValues("password") || "Passwords do not match.",
                        },
                      },
                      {
                        label: "Date of Birth*",
                        name: "dob",
                        type: "date",
                        validation: { required: "Date of Birth is required." },
                      },
                      {
                        label: "Blood Group*",
                        name: "blood_group",
                        type: "select",
                        options: [
                          "NA",
                          "A+",
                          "A-",
                          "B+",
                          "B-",
                          "O+",
                          "O-",
                          "AB+",
                          "AB-",
                        ],
                        validation: { required: "Blood Group is required." },
                      },
                      {
                        label: "Education Qualification",
                        name: "education_qualification",
                        type: "text",
                      },
                      { label: "Profession", name: "profession", type: "text" },
                      {
                        label: "Kuwait Contact*",
                        name: "kuwait_contact",
                        type: "tel",
                        validation: { required: "Kuwait Contact is required." },
                      },
                      {
                        label: "Kuwait WhatsApp*",
                        name: "kuwait_whatsapp",
                        type: "tel",
                        validation: { required: "Kuwait WhatsApp is required." },
                      },
                      {
                        label: "Gender*",
                        name: "gender",
                        type: "select",
                        options: ["Male", "Female"],
                        validation: { required: "Gender is required." },
                      },
                      {
                        label: "Marital Status",
                        name: "marital_status",
                        type: "select",
                        options: ["Single", "Married"],
                      },
                      {
                        label: "Family in Kuwait",
                        name: "family_in_kuwait",
                        type: "select",
                        options: ["Yes", "No"],
                      },
                    ].map((field, index) => (
                      <div key={index}>
                        <label
                          className="block text-sm font-medium text-gray-700"
                          htmlFor={field.name}
                        >
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            {...register(field.name, field.validation || {})}
                            className={`w-full border ${
                              errors[field.name] ? "border-red-500" : "border-gray-300"
                            } rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                          >
                            <option value="">Select</option>
                            {field.options &&
                              field.options.map((option, idx) => (
                                <option key={idx} value={option}>
                                  {option}
                                </option>
                              ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            {...register(field.name, field.validation || {})}
                            className={`w-full border ${
                              errors[field.name] ? "border-red-500" : "border-gray-300"
                            } rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                          />
                        )}
                        {errors[field.name] && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors[field.name].message}
                          </p>
                        )}
                      </div>
                    ))}

                    {/* Conditionally render the Profile Picture Upload field if Gender is "Male" */}
                    {gender === "Male" && (
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700"
                          htmlFor="profile_picture"
                        >
                          Upload Profile Picture
                        </label>
                        <input
                          type="file"
                          {...register("profile_picture")}
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.profilePicture && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.profilePicture.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Address & Contacts */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Address & Contacts
                  </h3>
                  <div className="space-y-6">
                    {/* Address (Kuwait) */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">
                        Address (Kuwait)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[
                          {
                            label: "Flat No.",
                            name: "flat_no",
                            type: "text",
                            required: false,
                          },
                          {
                            label: "Floor No.",
                            name: "floor_no",
                            type: "text",
                            required: false,
                          },
                          {
                            label: "Block No*",
                            name: "block_no",
                            type: "text",
                            required: true,
                          },
                          {
                            label: "Building Name/No.",
                            name: "building_name_no",
                            type: "text",
                            required: false,
                          },
                          {
                            label: "Street Name/No.",
                            name: "street_no_name",
                            type: "text",
                            required: false,
                          },
                          {
                            label: "Area*",
                            name: "area",
                            type: "text",
                            required: true,
                          },
                        ].map((field, index) => (
                          <div key={index}>
                            <label
                              className="block text-sm font-medium text-gray-700"
                              htmlFor={field.name}
                            >
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              {...register(field.name, {
                                required: field.required
                                  ? `${field.label} is required.`
                                  : false,
                              })}
                              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors[field.name] && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors[field.name].message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address (India) */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">
                        Address (India)
                      </h4>
                      <div className="grid grid-cols-1 gap-4 mt-4">
                        {[
                          {
                            label: "Complete Indian Address",
                            name: "residence_complete_address",
                            type: "textarea",
                            required: false,
                          },
                          {
                            label: "PIN No.*",
                            name: "pin_no_india",
                            type: "text",
                            required: true,
                          },
                        ].map((field, index) => (
                          <div key={index}>
                            <label
                              className="block text-sm font-medium text-gray-700"
                              htmlFor={field.name}
                            >
                              {field.label}
                            </label>
                            {field.type === "textarea" ? (
                              <textarea
                                {...register(field.name, {
                                  required: field.required
                                    ? `${field.label} is required.`
                                    : false,
                                })}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows="4"
                              ></textarea>
                            ) : (
                              <input
                                type={field.type}
                                {...register(field.name, {
                                  required: field.required
                                    ? `${field.label} is required.`
                                    : false,
                                })}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              />
                            )}
                            {errors[field.name] && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors[field.name].message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address (Permanent Native) */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">
                        Address (Permanent Native)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[
                          {
                            label: "Mohalla or Village",
                            name: "mohalla_village",
                            type: "text",
                            required: false,
                          },
                          {
                            label: "Taluka",
                            name: "taluka",
                            type: "text",
                            required: false,
                          },
                          {
                            label: "District",
                            name: "district",
                            type: "text",
                            required: false,
                          },
                          {
                            label: "Native PIN No.*",
                            name: "native_pin_no",
                            type: "text",
                            required: true,
                          },
                        ].map((field, index) => (
                          <div key={index}>
                            <label
                              className="block text-sm font-medium text-gray-700"
                              htmlFor={field.name}
                            >
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              {...register(field.name, {
                                required: field.required
                                  ? `${field.label} is required.`
                                  : false,
                              })}
                              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors[field.name] && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors[field.name].message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Numbers (India) */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">
                        Contact Numbers (India)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[
                          {
                            label: "Indian Contact No 1*",
                            name: "indian_contact_no_1",
                            type: "tel",
                            required: true,
                          },
                          {
                            label: "Indian Contact No 2",
                            name: "indian_contact_no_2",
                            type: "tel",
                            required: false,
                          },
                          {
                            label: "Indian Contact No 3",
                            name: "indian_contact_no_3",
                            type: "tel",
                            required: false,
                          },
                        ].map((field, index) => (
                          <div key={index}>
                            <label
                              className="block text-sm font-medium text-gray-700"
                              htmlFor={field.name}
                            >
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              {...register(field.name, {
                                required: field.required
                                  ? `${field.label} is required.`
                                  : false,
                              })}
                              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors[field.name] && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors[field.name].message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Emergency Contact (Kuwait) */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">
                        Emergency Contact (Kuwait)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[
                          {
                            label: "Emergency Name (Kuwait)*",
                            name: "emergency_name_kuwait",
                            type: "text",
                            required: true,
                          },
                          {
                            label: "Emergency Contact (Kuwait)*",
                            name: "emergency_contact_kuwait",
                            type: "tel",
                            required: true,
                          },
                        ].map((field, index) => (
                          <div key={index}>
                            <label
                              className="block text-sm font-medium text-gray-700"
                              htmlFor={field.name}
                            >
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              {...register(field.name, {
                                required: field.required
                                  ? `${field.label} is required.`
                                  : false,
                              })}
                              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors[field.name] && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors[field.name].message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Emergency Contact (India) */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">
                        Emergency Contact (India)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[
                          {
                            label: "Emergency Name (India)*",
                            name: "emergency_name_india",
                            type: "text",
                            required: true,
                          },
                          {
                            label: "Emergency Contact (India)*",
                            name: "emergency_contact_india",
                            type: "tel",
                            required: true,
                          },
                        ].map((field, index) => (
                          <div key={index}>
                            <label
                              className="block text-sm font-medium text-gray-700"
                              htmlFor={field.name}
                            >
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              {...register(field.name, {
                                required: field.required
                                  ? `${field.label} is required.`
                                  : false,
                              })}
                              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors[field.name] && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors[field.name].message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Family & MBS Nomination */}
              {currentStep === 4 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Family & MBS Nomination
                  </h3>
                  <div className="space-y-6">
                    {/* Family Section */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">Family</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[
                          { label: "Father's Name", name: "father_name", type: "text" },
                          { label: "Mother's Name", name: "mother_name", type: "text" },
                          { label: "Spouse's Name", name: "spouse_name", type: "text" },
                          { label: "Name of First Child", name: "child_name_1", type: "text" },
                          { label: "Name of Second Child", name: "child_name_2", type: "text" },
                          { label: "Name of Third Child", name: "child_name_3", type: "text" },
                          { label: "Name of Fourth Child", name: "child_name_4", type: "text" },
                          { label: "Name of Fifth Child", name: "child_name_5", type: "text" },
                        ].map((field, index) => (
                          <div key={index}>
                            <label
                              className="block text-sm font-medium text-gray-700"
                              htmlFor={field.name}
                            >
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              {...register(field.name)}
                              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">Additional Information</h4>
                      <div className="mt-4">
                        <label
                          className="block text-sm font-medium text-gray-700"
                          htmlFor="additional_information"
                        >
                          Any additional information to pass to KWS on registration
                        </label>
                        <textarea
                          {...register("additional_information")}
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          rows="4"
                        ></textarea>
                      </div>
                    </div>

                    {/* MBS Nomination Section */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">
                        MBS Nomination
                      </h4>
                      <div className="grid grid-cols-1 gap-4 mt-4">
                        {/* Number of Nominations */}
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="numberOfNominations"
                          >
                            Number of Nominations*
                          </label>
                          <select
                            {...register("numberOfNominations", {
                              required: "Number of nominations is required.",
                            })}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          >
                            <option value="">Select</option>
                            {[1, 2, 3, 4].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                          {errors.numberOfNominations && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.numberOfNominations.message}
                            </p>
                          )}
                        </div>

                        {/* Dynamic Nominee Fields */}
                        {[...Array(parseInt(numberOfNominations) || 0)].map((_, idx) => (
                          <div key={idx} className="border-t pt-4">
                            <h5 className="text-md font-semibold text-gray-700 mb-2">
                              Nominee {idx + 1}
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                {
                                  label: `Name of ${idx + 1}st Nominee*`,
                                  name: `full_name_${idx + 1}`,
                                  type: "text",
                                  validation: {
                                    required: `Name of nominee ${idx + 1} is required.`,
                                  },
                                },
                                {
                                  label: "Relationship*",
                                  name: `relation_${idx + 1}`,
                                  type: "text",
                                  validation: {
                                    required: `Relationship is required for nominee ${idx + 1}.`,
                                  },
                                },
                                {
                                  label: "Percentage*",
                                  name: `percentage_${idx + 1}`,
                                  type: "number",
                                  validation: {
                                    required: `Percentage is required for nominee ${idx + 1}.`,
                                  },
                                },
                                {
                                  label: "Contact*",
                                  name: `mobile_${idx + 1}`,
                                  type: "tel",
                                  validation: {
                                    required: `Contact is required for nominee ${idx + 1}.`,
                                  },
                                },
                              ].map((field, index) => (
                                <div key={index}>
                                  <label
                                    className="block text-sm font-medium text-gray-700"
                                    htmlFor={field.name}
                                  >
                                    {field.label}
                                  </label>
                                  <input
                                    type={field.type}
                                    {...register(field.name, field.validation)}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                                  {errors[field.name] && (
                                    <p className="text-red-500 text-sm mt-2">
                                      {errors[field.name].message}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Confirmation Checkbox */}
                        <div className="mt-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              {...register("reviewInfo", {
                                required: "Please confirm your information.",
                              })}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="text-gray-700">
                              I confirm all information provided is correct.
                            </span>
                          </label>
                          {errors.reviewInfo && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.reviewInfo.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Back
                  </button>
                )}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          </FormProvider>

          {/* Submission Confirmation Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
              <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
                {!isSubmitted ? (
                  <>
                    <h3 className="text-xl font-bold mb-4">Confirm Submission</h3>
                    <p className="mb-6">
                      Are you sure you want to submit the form? Please review your information before confirming.
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={handleCancelSubmit}
                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Confirm
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-4">Success</h3>
                    <p className="mb-6 text-green-600">
                      Your form was submitted successfully!
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          window.location.reload();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        OK
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
