"use client";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const methods = useForm(); // React Hook Form methods
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (data) => {
    console.log("Form Submitted:", data);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            {currentStep === 1 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Step 1: Disclaimer</h3>
                <p className="text-gray-600 mb-4">
                  {/* Insert your disclaimer content here */}
                  Please read the following disclaimer carefully before proceeding.
                </p>
                <div className="mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...methods.register("acceptDisclaimer", { required: true })}
                      className="form-checkbox"
                    />
                    <span>I agree to the disclaimer</span>
                  </label>
                  {methods.formState.errors.acceptDisclaimer && (
                    <p className="text-red-500 text-sm mt-2">You must accept the disclaimer.</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Step 2: Personal Details</h3>
                <div className="mb-4">
                  <label className="block text-gray-700">First Name</label>
                  <input
                    type="text"
                    {...methods.register("firstName", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {methods.formState.errors.firstName && (
                    <p className="text-red-500 text-sm mt-2">First Name is required.</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Last Name</label>
                  <input
                    type="text"
                    {...methods.register("lastName", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {methods.formState.errors.lastName && (
                    <p className="text-red-500 text-sm mt-2">Last Name is required.</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Step 3: Contact Details</h3>
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    {...methods.register("email", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {methods.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-2">Email is required.</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="tel"
                    {...methods.register("phone", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {methods.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-2">Phone is required.</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Step 4: Review & Submit</h3>
                <p className="text-gray-600 mb-4">Please review your information before submitting.</p>
                <ul className="list-disc ml-6">
                  <li>First Name: {methods.watch("firstName")}</li>
                  <li>Last Name: {methods.watch("lastName")}</li>
                  <li>Email: {methods.watch("email")}</li>
                  <li>Phone: {methods.watch("phone")}</li>
                </ul>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
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
      </div>
    </div>
  );
};

export default Register;
