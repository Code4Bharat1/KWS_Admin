"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import axios from "axios";

import areaData from "../../../data/area.json";

const Register = () => {
  const methods = useForm({
    mode: "onChange",
    shouldUnregister: false,
  });
  const {
    register,
    getValues,
    handleSubmit,
    formState,
    clearErrors,
    trigger,
    setError,
    setValue,
    watch,
  } = methods;
  const { errors, isValid } = formState;
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [backendErrors, setBackendErrors] = useState([]);
  const [profileError, setProfileError] = useState("");

  const totalSteps = 4;
  const districtPinMap = {
    Mumbai: "400001",
    "Navi Mumbai": "400614",
    Thane: "400601",
    Ratnagiri: "415612",
    Raigad: "402201",
    Sindhudurg: "416602",
  };

  const selectedDistrict = watch("district");

  // Update PIN when the district changes
  useEffect(() => {
    if (selectedDistrict && districtPinMap[selectedDistrict]) {
      setValue("native_pin_no", districtPinMap[selectedDistrict]);
    } else {
      setValue("native_pin_no", ""); // Clear if invalid
    }
  }, [selectedDistrict, setValue]);

  const onAreaChange = (e) => {
    const selectedArea = e.target.value;
    const found = areaData.find((item) => item.area === selectedArea);
    if (found) {
      // Automatically set the PIN code field when an area is selected
      setValue("pin_no_india", found.pincode);
    } else {
      setValue("pin_no_india", "");
    }
  };

  // Watch dynamic fields.
  const numberOfNominations = useWatch({
    control: methods.control,
    name: "numberOfNominations",
    defaultValue: "1",
  });

  useEffect(() => {
    const num = parseInt(numberOfNominations, 10) || 0;
    if (num > 0) {
      const equalPercentage = (100 / num).toFixed(2);
      for (let i = 1; i <= num; i++) {
        setValue(`percentage_${i}`, equalPercentage);
      }
    }
  }, [numberOfNominations, setValue]);

  const generaladdress = watch("generaladdress");
  const taluka2 = watch("taluka2");
  const city = watch("city");
  const village2 = watch("village2");
  const area2 = watch("area2");

  useEffect(() => {
    if (generaladdress || taluka2 || city || village2 || area2) {
      const formattedAddress = `${generaladdress ? generaladdress + ", " : ""}${
        village2 ? village2 + ", " : ""
      }${area2 ? area2 + ", " : ""}${taluka2}, ${city}`;
      setValue("residence_complete_address", formattedAddress);
    }
  }, [generaladdress, taluka2, city, village2, area2, setValue]);

  const gender = useWatch({
    control: methods.control,
    name: "gender",
    defaultValue: "",
  });

  const civilId = watch("civil_id");
  const email = watch("email");
  let civilIdCancelToken;
  let emailCancelToken;

  useEffect(() => {
    if (civilId && civilId.length === 12) {
      if (civilIdCancelToken) {
        civilIdCancelToken.cancel("Operation canceled due to new request.");
      }
      civilIdCancelToken = axios.CancelToken.source();

      const checkCivilId = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/auth/civilid`,
            {
              params: { civil_id: civilId },
              cancelToken: civilIdCancelToken.token,
            }
          );

          if (response.data.exists) {
            setError("civil_id", {
              type: "manual",
              message: "Civil ID already exists.",
            });
          } else {
            clearErrors("civil_id"); // Clear error when valid
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error("Error checking Civil ID:", error);
          }
        }
      };

      const delayDebounceFn = setTimeout(checkCivilId, 500); // Debounce request
      return () => clearTimeout(delayDebounceFn);
    }
  }, [civilId, setError, clearErrors]);

  // Check Email existence
  useEffect(() => {
    if (email && email.includes("@")) {
      if (emailCancelToken) {
        emailCancelToken.cancel("Operation canceled due to new request.");
      }
      emailCancelToken = axios.CancelToken.source();// ye cancel token hum isiliye use kar rhe h kyuki ye har letter enter karne pe db me req bhejega check karne ki to aise multiple req jayegi db aur jo latest req h wo overwritten hojayegi to isisliye jab user ne galti se wrong civil id daldi to wo req gayi fir user proper
      // civil id daldi to wo req db tak nhi pauchegi isiliye cancel token karte h jo purani req ko khatam kardeti h nayi req bhejne se pehle       //

      const checkEmail = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/auth/email`,
            {
              params: { email },
              cancelToken: emailCancelToken.token,
            }
          );

          if (response.data.exists) {
            setError("email", {
              type: "manual",
              message: "Email already exists.",
            });
          } else {
            clearErrors("email"); // Clear error when valid
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error("Error checking email:", error);
          }
        }
      };

      const delayDebounceFn = setTimeout(checkEmail, 500); // Debounce request
      return () => clearTimeout(delayDebounceFn);
    }
  }, [email, setError, clearErrors]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileSizeMB = file.size / 1024 / 1024;
      const validExtensions = ["image/jpeg", "image/jpg", "image/png"];

      if (!validExtensions.includes(file.type)) {
        setProfileError("Only JPG, JPEG, and PNG formats are allowed.");
        setProfilePicture(null);
        return;
      }

      if (fileSizeMB > 2) {
        setProfileError("File size must be 2MB or less.");
        setProfilePicture(null);
        return;
      }

      setProfilePicture(file);
      setProfileError("");
    }
  };

  const getStepFields = (step) => {
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
      ],
      3: [
        "block_no",
        "area",
        "pin_no_india",
        "native_pin_no",
        "district",
        "generaladdress",
        "district2",
        "taluka2",
        "general_address",
        "indian_contact_no_1",
        "emergency_name_kuwait",
        "emergency_contact_kuwait",
        "emergency_name_india",
        "emergency_contact_india",
      ],
      4: ["father_name", "mother_name", "numberOfNominations", "reviewInfo"],
    };
    return requiredFieldsByStep[step];
  };

  // Navigation handlers.
  const handleNext = async () => {
    if (currentStep === 2 && gender === "Male" && !profilePicture) {
      setProfileError("Profile picture is required for male.");
      return;
    }

    const isStepValid = await trigger(getStepFields(currentStep));
    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = (data) => {
    setFormData(data);
    setIsModalOpen(true);
  };

  const onError = (errors) => {
    // Get the first error field key
    const firstErrorKey = Object.keys(errors)[0];

    // Identify the step where the error occurs
    const stepWithError = Object.entries(getStepFields(currentStep)).findIndex(
      ([, fields]) => fields.includes(firstErrorKey)
    );

    // Navigate to the step with the error
    if (stepWithError !== -1 && stepWithError + 1 !== currentStep) {
      setCurrentStep(stepWithError + 1);
    }

    // Scroll to the first error field
    const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
    if (errorElement) {
      errorElement.focus();
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Open the error modal
    setBackendErrors(
      Object.entries(errors).map(([key, value]) => ({
        field: key,
        message: value?.message || "Invalid value",
      }))
    );
    setErrorModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (profileError) {
      setErrorModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const multipartFormData = new FormData();

      // Append regular fields.
      Object.keys(formData).forEach((key) => {
        if (key === "profile_picture" && formData.profile_picture?.length > 0) {
          multipartFormData.append(key, formData.profile_picture[0]);
        } else {
          multipartFormData.append(key, formData[key]);
        }
      });

      const childNames = [];
      for (let i = 1; i <= 5; i++) {
        const childName = getValues(`child_name_${i}`);
        if (childName) {
          childNames.push(childName);
        }
      }
      multipartFormData.append("child_names", JSON.stringify(childNames));

      const nominations = [];
      const nNominees = parseInt(getValues("numberOfNominations"), 10) || 0;
      for (let i = 1; i <= nNominees; i++) {
        const nomination = {
          name: getValues(`full_name_${i}`) || "",
          relation: getValues(`relation_${i}`) || "",
          percentage: getValues(`percentage_${i}`) || "",
          contact: getValues(`mobile_${i}`) || "",
        };
        nominations.push(nomination);
      }
      multipartFormData.append("nominations", JSON.stringify(nominations));

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/auth/register`,
        multipartFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setIsSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      // Handle the error properly here
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );

      // Handle specific errors for form fields
      if (error.response && error.response.data) {
        const { message } = error.response.data;

        if (message.includes("Civil ID")) {
          setError("civil_id", { type: "manual", message });
        }
        if (message.includes("Email")) {
          setError("email", { type: "manual", message });
        }
      }
      setIsModalOpen(false);
      setBackendErrors([{ field: "Server Error", message: errorMessage }]);
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllErrors = () => {
    const frontendErrors = Object.keys(errors).map((key) => ({
      field: key,
      message: errors[key]?.message || "Invalid value",
    }));

    const backendFormattedErrors = backendErrors.map((error) => ({
      field: error.field || "Server Error",
      message: error.message || error,
    }));

    return [...frontendErrors, ...backendFormattedErrors].map((error) => ({
      field: String(error.field),
      message: String(error.message),
    }));
  };

  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  const handleCancelSubmit = () => {
    setIsModalOpen(false);
  };

  // Step titles.
  const stepTitles = [
    "Disclaimer",
    "Personal Details",
    "Address & Contacts",
    "Family & MBS Nomination",
  ];

  const sortedAreas = areaData.sort((a, b) => a.area.localeCompare(b.area));

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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-5"></div>
      {/* Content */}
      <div className="relative flex justify-center items-center min-h-screen p-4">
        <div className="bg-white shadow-lg rounded-lg w-full md:w-4/5 lg:w-2/3 xl:w-1/2 p-8 relative z-10">
          {/* Stepper (clickable for navigation) */}
          <div className="flex justify-between mb-8">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer"
                // onClick={() => setCurrentStep(index + 1)}
              >
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
                {index < stepTitles.length - 1 && (
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
            <div className="w-full md:w-1/3 flex justify-center md:justify-start mb-4 md:mb-0">
              <img
                src="/kws.png"
                alt="Logo"
                className="w-36 h-28 object-contain"
              />
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h2 className="text-2xl text-blue-500 font-syne font-bold">
                KWS Membership Registration
              </h2>
            </div>
          </div>

          <FormProvider {...methods}>
            {/* Final submission uses onSubmit and onError */}
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              {/* STEP 1: Disclaimer */}
              {currentStep === 1 && (
                <div>
                  <p className="text-gray-600 mb-4 text-center">
                    Please read the following document carefully before
                    proceeding.
                  </p>
                  <div className="mb-6">
                    <div className="border border-gray-300 rounded-lg overflow-hidden h-[400px] md:h-[600px]">
                      <iframe
                        src="/disclaimerr.pdf#toolbar=0&view=FitH"
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

              {/* STEP 2: Personal Details */}
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
                        type: "number",
                        validation: {
                          required: "Civil ID is required.",
                          pattern: {
                            value: /^\d{12}$/, // This regular expression checks for exactly 12 digits.
                            message: "Civil ID must be  12 digits.",
                          },
                        },
                      },
                      {
                        label: "First Name*",
                        name: "first_name",
                        type: "text",
                        validation: { required: "First Name is required." },
                      },
                      {
                        label: "Middle Name",
                        name: "middle_name",
                        type: "text",
                      },
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
                        label: "Date of Birth*",
                        name: "dob",
                        type: "date",
                        validation: { required: "Date of Birth is required." },
                      },
                      {
                        label: "Password*",
                        name: "password",
                        type: "password",
                        validation: {
                          required: "Password is required.",
                          minLength: {
                            value: 8,
                            message:
                              "Password must be at least 8 characters long.",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
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
                            value === getValues("password") ||
                            "Passwords do not match.",
                        },
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
                        label: "Family in Kuwait",
                        name: "family_in_kuwait",
                        type: "select",
                        options: ["Yes", "No"],
                      },
                      {
                        label: "Kuwait Contact*",
                        name: "kuwait_contact",
                        type: "tel", // Ensures mobile devices display a numeric keypad
                        validation: {
                          required: "Kuwait Contact is required.",
                          pattern: {
                            value: /^[0-9+\-()]{4,15}$/, // Allows only numbers & special characters (+, -, ())
                            message:
                              "Enter a valid contact number (4-15 digits, no alphabets).",
                          },
                        },
                        inputMode: "numeric", // Ensures numeric keyboard on mobile devices
                        autoComplete: "off",
                        onKeyDown: (e) => {
                          // Allow only numbers (0-9), "+", "-", "(", ")", Backspace, Delete, Arrow keys
                          if (
                            !/^[0-9+\-()]+$/.test(e.key) &&
                            ![
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                            ].includes(e.key)
                          ) {
                            e.preventDefault(); // Blocks any alphabets or unwanted characters
                          }
                        },
                        onInput: (e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9+\-()]/g,
                            ""
                          ); // Removes unwanted characters on paste
                        },
                      },

                      {
                        label: "Kuwait WhatsApp*",
                        name: "kuwait_whatsapp",
                        type: "tel", // Ensures mobile devices display a numeric keypad
                        validation: {
                          required: "Kuwait WhatsApp is required.",
                          pattern: {
                            value: /^[0-9+\-()]{4,15}$/, // Allows only numbers & special characters (+, -, ())
                            message:
                              "Enter a valid contact number (4-15 digits, no alphabets).",
                          },
                        },
                        inputMode: "numeric", // Ensures numeric keyboard on mobile devices
                        autoComplete: "off",
                        onKeyDown: (e) => {
                          // Allow only numbers (0-9), "+", "-", "(", ")", Backspace, Delete, Arrow keys
                          if (
                            !/^[0-9+\-()]+$/.test(e.key) &&
                            ![
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                            ].includes(e.key)
                          ) {
                            e.preventDefault(); // Blocks any alphabets or unwanted characters
                          }
                        },
                        onInput: (e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9+\-()]/g,
                            ""
                          ); // Removes unwanted characters on paste
                        },
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
                              errors[field.name]
                                ? "border-red-500"
                                : "border-gray-300"
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
                              errors[field.name]
                                ? "border-red-500"
                                : "border-gray-300"
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
                    {/* Conditional Profile Picture Upload for Male */}
                    {gender === "Male" && (
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700"
                          htmlFor="profile_picture"
                        >
                          Upload Profile Picture * (Max 2MB)
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg, image/jpg, image/png"
                          {...register("profile_picture")}
                          onChange={handleProfilePictureChange}
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />

                        {profileError && (
                          <p className="text-red-500 text-sm mt-2">
                            {profileError}
                          </p>
                        )}
                        {errors.profile_picture && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.profile_picture.message}
                          </p>
                        )}
                        {profilePicture && (
                          <div className="mt-4">
                            <img
                              src={URL.createObjectURL(profilePicture)}
                              alt="Profile Preview"
                              className="w-20 h-20 object-cover rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Address & Contacts */}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="generaladdress"
                          >
                            General Address*
                          </label>
                          <input
                            type="text"
                            {...register("generaladdress", {
                              required: "General Address is required.",
                            })}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          {errors.generaladdress && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.generaladdress.message}
                            </p>
                          )}
                        </div>

                        {/* Taluka */}
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="taluka2"
                          >
                            Taluka*
                          </label>
                          <input
                            type="text"
                            {...register("taluka2", {
                              required: "Taluka is required.",
                            })}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          {errors.taluka2 && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.taluka2.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="city"
                          >
                            City*
                          </label>
                          <input
                            type="text"
                            {...register("city", {
                              required: "City is required.",
                            })}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.city.message}
                            </p>
                          )}
                        </div>

                        {/* District
                        <div>
                          <label className="block text-sm font-medium text-gray-700" htmlFor="district2">
                            District*
                          </label>
                          <select
  {...register("district2", { required: "District is required." })}
  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
>
  <option value="">Select District</option>
  {["Mumbai", "Navi Mumbai", "Thane", "Ratnagiri", "Raigad", "Sindhudurg"].map((district, idx) => (
    <option key={`district2-${idx}`} value={district}>
      {district}
    </option>
  ))}
</select>
                          {errors.district2 && <p className="text-red-500 text-sm mt-2">{errors.district2.message}</p>}
                        </div> */}

                        {/* Village */}
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="village2"
                          >
                            Village
                          </label>
                          <input
                            type="text"
                            {...register("village2")}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        {/* Area */}
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="area2"
                          >
                            Area
                          </label>
                          <select
                            {...register("area2", { onChange: onAreaChange })}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          >
                            <option value="">Select Area</option>
                            {sortedAreas.map((item, index) => (
                              <option key={index} value={item.area}>
                                {item.area}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* PIN Code Field */}
                        <div className="mt-0">
                          <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="pin_no_india"
                          >
                            PIN No.*
                          </label>
                          <input
                            type="number"
                            {...register("pin_no_india", {
                              required: "PIN Code is required.",
                            })}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          {errors.pin_no_india && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.pin_no_india.message}
                            </p>
                          )}
                        </div>
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
                            label: "General Address*",
                            name: "general_address",
                            type: "text",
                            required: true,
                          },
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
                            label: "District*",
                            name: "district",
                            type: "select",
                            options: [
                              "Mumbai",
                              "Navi Mumbai",
                              "Thane",
                              "Ratnagiri",
                              "Raigad",
                              "Sindhudurg",
                            ],
                            required: true,
                          },
                          {
                            label: "Native PIN No.*",
                            name: "native_pin_no",
                            type: "number",
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
                            {field.type === "select" ? (
                              <select
                                {...register(field.name, {
                                  required: field.required
                                    ? `${field.label} is required.`
                                    : true,
                                })}
                                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  Select {field.label}
                                </option>
                                {field.options.map((option, idx) => (
                                  <option key={idx} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={field.type}
                                {...register(field.name, {
                                  required: field.required
                                    ? `${field.label} is required.`
                                    : false,
                                })}
                                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                            required: true, // Required field
                          },
                          {
                            label: "Indian Contact No 2",
                            name: "indian_contact_no_2",
                            required: false, // Optional field
                          },
                          {
                            label: "Indian Contact No 3",
                            name: "indian_contact_no_3",
                            required: false, // Optional field
                          },
                        ].map((field, index) => (
                          <div key={index}>
                            <label
                              className="block text-sm font-medium text-gray-700"
                              htmlFor={field.name}
                            >
                              {field.label}
                            </label>

                            <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500">
                              <span className="text-gray-600 font-bold mr-2">
                                +91
                              </span>
                              <input
                                type="tel"
                                {...register(field.name, {
                                  required: field.required
                                    ? `${field.label} is required.`
                                    : false,
                                  pattern: {
                                    value: /^[0-9]{10}$/, // Ensures exactly 10 digits (excluding +91)
                                    message:
                                      "Must be exactly 10 digits after +91.",
                                  },
                                  minLength: {
                                    value: 10,
                                    message:
                                      "Must be exactly 10 digits after +91.",
                                  },
                                  maxLength: {
                                    value: 10,
                                    message:
                                      "Must be exactly 10 digits after +91.",
                                  },
                                })}
                                inputMode="numeric"
                                className="w-full focus:outline-none"
                                onKeyDown={(e) => {
                                  if (
                                    !/^[0-9]$/.test(e.key) &&
                                    ![
                                      "Backspace",
                                      "Delete",
                                      "ArrowLeft",
                                      "ArrowRight",
                                    ].includes(e.key)
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                                onInput={(e) => {
                                  e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 10); // Ensures only 10 digits
                                }}
                              />
                            </div>

                            {errors[field.name] && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors[field.name].message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Emergency Contacts */}
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
                            validation: {
                              required: "Emergency Name (Kuwait) is required.",
                              pattern: {
                                value: /^[A-Za-z\s]+$/, // Allows only letters and spaces
                                message: "Only alphabets are allowed.",
                              },
                            },
                            onKeyDown: (e) => {
                              if (
                                !/^[A-Za-z\s]$/.test(e.key) &&
                                ![
                                  "Backspace",
                                  "Delete",
                                  "ArrowLeft",
                                  "ArrowRight",
                                ].includes(e.key)
                              ) {
                                e.preventDefault();
                              }
                            },
                            onInput: (e) => {
                              e.target.value = e.target.value.replace(
                                /[^A-Za-z\s]/g,
                                ""
                              ); // Removes non-alphabet characters
                            },
                          },
                          {
                            label: "Emergency Contact (Kuwait)*",
                            name: "emergency_contact_kuwait",
                            type: "tel", // Ensures mobile devices display a numeric keypad
                            required: true,
                            validation: {
                              required:
                                "Emergency Contact (Kuwait) is required.",
                              pattern: {
                                value: /^[0-9+\-() ]{8,15}$/, // Allows numbers and special characters (+, -, (), space)
                                message:
                                  "Must be a valid phone number (8-15 digits, numbers and +, -, () allowed).",
                              },
                              minLength: {
                                value: 8,
                                message: "Must be at least 8 characters.",
                              },
                              maxLength: {
                                value: 15,
                                message: "Must be at most 15 characters.",
                              },
                            },
                            inputMode: "numeric",
                            onKeyDown: (e) => {
                              if (
                                !/^[0-9+\-() ]$/.test(e.key) &&
                                ![
                                  "Backspace",
                                  "Delete",
                                  "ArrowLeft",
                                  "ArrowRight",
                                ].includes(e.key)
                              ) {
                                e.preventDefault(); // Prevents alphabets and other special characters
                              }
                            },
                            onInput: (e) => {
                              e.target.value = e.target.value
                                .replace(/[^0-9+\-() ]/g, "")
                                .slice(0, 15); // Ensures only allowed characters
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
                              inputMode={field.inputMode || "text"}
                              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              onKeyDown={field.onKeyDown}
                              onInput={field.onInput}
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
                            validation: {
                              required: "Emergency Name (India) is required.",
                              pattern: {
                                value: /^[A-Za-z\s]+$/, // Allows only letters and spaces
                                message: "Only alphabets are allowed.",
                              },
                            },
                            onKeyDown: (e) => {
                              if (
                                !/^[A-Za-z\s]$/.test(e.key) &&
                                ![
                                  "Backspace",
                                  "Delete",
                                  "ArrowLeft",
                                  "ArrowRight",
                                ].includes(e.key)
                              ) {
                                e.preventDefault();
                              }
                            },
                            onInput: (e) => {
                              e.target.value = e.target.value.replace(
                                /[^A-Za-z\s]/g,
                                ""
                              ); // Removes non-alphabet characters
                            },
                          },
                          {
                            label: "Emergency Contact (India)*",
                            name: "emergency_contact_india",
                            type: "tel",
                            required: true,
                            validation: {
                              required:
                                "Emergency Contact (India) is required.",
                              pattern: {
                                value: /^[0-9+\-() ]{10,15}$/, // Allows numbers and special characters
                                message:
                                  "Must be a valid phone number (10-15 digits, numbers and +, -, () allowed).",
                              },
                              minLength: {
                                value: 10,
                                message: "Must be at least 10 characters.",
                              },
                              maxLength: {
                                value: 15,
                                message: "Must be at most 15 characters.",
                              },
                            },
                            inputMode: "numeric",
                            onKeyDown: (e) => {
                              if (
                                !/^[0-9+\-() ]$/.test(e.key) &&
                                ![
                                  "Backspace",
                                  "Delete",
                                  "ArrowLeft",
                                  "ArrowRight",
                                ].includes(e.key)
                              ) {
                                e.preventDefault(); // Prevents alphabets and other special characters
                              }
                            },
                            onInput: (e) => {
                              e.target.value = e.target.value
                                .replace(/[^0-9+\-() ]/g, "")
                                .slice(0, 15); // Ensures only allowed characters
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
                              inputMode={field.inputMode || "text"}
                              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              onKeyDown={field.onKeyDown}
                              onInput={field.onInput}
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

              {/* STEP 4: Family & MBS Nomination */}
              {currentStep === 4 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Family & MBS Nomination
                  </h3>
                  <div className="space-y-6">
                    {/* Family Section */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">
                        Family
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[
                          {
                            label: "Father's Name*",
                            name: "father_name",
                            type: "text",
                            required: true,
                          },
                          {
                            label: "Mother's Name*",
                            name: "mother_name",
                            type: "text",
                            required: true,
                          },
                          {
                            label: "Spouse's Name",
                            name: "spouse_name",
                            type: "text",
                          },
                          {
                            label: "Name of First Child",
                            name: "child_name_1",
                            type: "text",
                          },
                          {
                            label: "Name of Second Child",
                            name: "child_name_2",
                            type: "text",
                          },
                          {
                            label: "Name of Third Child",
                            name: "child_name_3",
                            type: "text",
                          },
                          {
                            label: "Name of Fourth Child",
                            name: "child_name_4",
                            type: "text",
                          },
                          {
                            label: "Name of Fifth Child",
                            name: "child_name_5",
                            type: "text",
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
                              className={`w-full border ${
                                errors[field.name]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                            />
                            {errors[field.name] && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors[field.name]?.message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">
                        Additional Information
                      </h4>
                      <div className="mt-4">
                        <label
                          className="block text-sm font-medium text-gray-700"
                          htmlFor="additional_information"
                        >
                          Any additional information to pass to KWS on
                          registration
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
                        {[...Array(parseInt(numberOfNominations) || 0)].map(
                          (_, idx) => (
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
                                      required: `Name of nominee ${
                                        idx + 1
                                      } is required.`,
                                    },
                                  },
                                  {
                                    label: "Relationship*",
                                    name: `relation_${idx + 1}`,
                                    type: "text",
                                    validation: {
                                      required: `Relationship is required for nominee ${
                                        idx + 1
                                      }.`,
                                    },
                                  },
                                  {
                                    label: "Percentage*",
                                    name: `percentage_${idx + 1}`,
                                    type: "number",
                                    validation: {
                                      required: `Percentage is required for nominee ${
                                        idx + 1
                                      }.`,
                                    },
                                  },
                                  {
                                    label: "Contact*",
                                    name: `mobile_${idx + 1}`,
                                    type: "tel",
                                    validation: {
                                      required: `Contact is required for nominee ${
                                        idx + 1
                                      }.`,
                                      pattern: {
                                        value: /^[0-9+\-() ]{8,15}$/, // Allows numbers and special characters +, -, (), spaces
                                        message:
                                          "Must be between 8 to 15 characters (numbers and +, -, () allowed).",
                                      },
                                      minLength: {
                                        value: 8,
                                        message:
                                          "Must be at least 8 characters.",
                                      },
                                      maxLength: {
                                        value: 15,
                                        message:
                                          "Must be at most 15 characters.",
                                      },
                                    },
                                    inputMode: "numeric", // Ensures numeric keyboard on mobile devices
                                    onKeyDown: (e) => {
                                      if (
                                        !/^[0-9+\-() ]$/.test(e.key) &&
                                        ![
                                          "Backspace",
                                          "Delete",
                                          "ArrowLeft",
                                          "ArrowRight",
                                        ].includes(e.key)
                                      ) {
                                        e.preventDefault(); // Prevents alphabets and other special characters
                                      }
                                    },
                                    onInput: (e) => {
                                      e.target.value = e.target.value
                                        .replace(/[^0-9+\-() ]/g, "")
                                        .slice(0, 15); // Ensures only allowed characters
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
                                      {...register(
                                        field.name,
                                        field.validation
                                      )}
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
                          )
                        )}

                        <div className="mt-4 space-y-4">
                          <h1 className="font-semibold text-gray-800 ">
                            Membership Type
                          </h1>
                          {[
                            {
                              label:
                                "LIFE MEMBERSHIP - 150 KWD (ONE TIME PAYMENT)",
                              value:
                                "LIFE MEMBERSHIP - 150 KWD (ONE TIME PAYMENT)",
                            },
                            {
                              label: "ELITE MEMBERSHIP - 12 KWD PER YEAR",
                              value: "ELITE MEMBERSHIP - 12 KWD PER YEAR",
                            },
                            {
                              label:
                                "PRIVILEGE MEMBER - 4 KWD - 5 YEARS (1 KWD PER YEAR)",
                              value:
                                "PRIVILEGE MEMBER - 4 KWD - 5 YEARS (1 KWD PER YEAR)",
                            },
                          ].map((option, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="radio"
                                id={option.value}
                                value={option.value}
                                {...register("requested_membership", {
                                  required: "Membership type is required.",
                                })}
                                className="form-radio h-5 w-5 text-blue-600"
                              />
                              <label
                                htmlFor={option.value}
                                className="ml-3 text-gray-700"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                          {errors.requested_membership && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.requested_membership.message}
                            </p>
                          )}
                        </div>

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
                              I confirm that all information provided by me is
                              correct & I will pay the membership fees given
                              above.{" "}
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
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Back
                </button>
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  // Disable the Submit button until all required fields are valid.
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`px-4 py-2 ${
                      !isValid
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white rounded-lg`}
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          </FormProvider>

          {/* Error Modal */}
          {errorModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
              <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
                <h3 className="text-xl font-bold mb-4">Warning</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {getAllErrors().map((error, index) => (
                    <li key={index} className="text-red-500 text-sm">
                      <strong>{error.field}:</strong> {error.message}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={closeErrorModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
              <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
                {!isSubmitted ? (
                  <>
                    <h3 className="text-xl font-bold mb-4">
                      Confirm Submission
                    </h3>
                    <p className="mb-6">
                      Are you sure you want to submit the form? Please review
                      your information before confirming.
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
