import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCreditCard,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPassport,
  FaCalendarAlt,
  FaShieldAlt,
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
  FaPlane,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const flight =
    location.state?.flight ||
    JSON.parse(new URLSearchParams(location.search).get("flight") || "{}");
  const passengerCount = location.state?.passengerCount || 1;

  const [formData, setFormData] = useState({
    // Passenger Details
    passengers: Array(passengerCount)
      .fill()
      .map(() => ({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        passportNumber: "",
        nationality: "",
        dateOfBirth: "",
      })),

    // Contact Information
    contactEmail: "",
    contactPhone: "",

    // Payment Details
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",

    // Extras
    seatSelection: "auto",
    baggage: "standard",
    insurance: false,
    newsletter: true,
  });

  const totalPrice = flight.price * passengerCount;
  const baggageFee = formData.baggage === "extra" ? 30 : 0;
  const insuranceFee = formData.insurance ? 15 : 0;
  const taxes = totalPrice * 0.15;
  const grandTotal = totalPrice + baggageFee + insuranceFee + taxes;

  useEffect(() => {
    if (!flight.id) {
      navigate("/");
    }
  }, [flight, navigate]);

  const validateStep1 = () => {
    const newErrors = {};

    // Validate each passenger
    formData.passengers.forEach((passenger, index) => {
      if (!passenger.firstName?.trim()) {
        newErrors[`passenger${index}FirstName`] = "First name is required";
      }
      if (!passenger.lastName?.trim()) {
        newErrors[`passenger${index}LastName`] = "Last name is required";
      }
      if (!passenger.email?.trim()) {
        newErrors[`passenger${index}Email`] = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
        newErrors[`passenger${index}Email`] = "Email is invalid";
      }
      if (!passenger.phone?.trim()) {
        newErrors[`passenger${index}Phone`] = "Phone number is required";
      } else if (
        !/^\+?[1-9]\d{0,15}$/.test(passenger.phone.replace(/\D/g, ""))
      ) {
        newErrors[`passenger${index}Phone`] = "Phone number is invalid";
      }
      if (!passenger.passportNumber?.trim()) {
        newErrors[`passenger${index}Passport`] = "Passport number is required";
      }
      if (!passenger.nationality) {
        newErrors[`passenger${index}Nationality`] = "Nationality is required";
      }
      if (!passenger.dateOfBirth) {
        newErrors[`passenger${index}DOB`] = "Date of birth is required";
      }
    });

    // Validate contact information
    if (!formData.contactEmail?.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Contact email is invalid";
    }

    if (!formData.contactPhone?.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    } else if (
      !/^\+?[1-9]\d{0,15}$/.test(formData.contactPhone.replace(/\D/g, ""))
    ) {
      newErrors.contactPhone = "Contact phone is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    // Validate card number (16 digits, can have spaces)
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, "");
    if (!formData.cardNumber?.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(cleanCardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    // Validate card holder
    if (!formData.cardHolder?.trim()) {
      newErrors.cardHolder = "Card holder name is required";
    } else if (formData.cardHolder.trim().length < 2) {
      newErrors.cardHolder = "Enter full name as on card";
    }

    // Validate expiry date (MM/YY format)
    if (!formData.expiryDate?.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Format: MM/YY";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    // Validate CVV
    if (!formData.cvv?.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    // Validate billing address
    if (!formData.billingAddress?.trim()) {
      newErrors.billingAddress = "Billing address is required";
    } else if (formData.billingAddress.trim().length < 10) {
      newErrors.billingAddress = "Please enter full address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section, field, value, passengerIndex = null) => {
    setFormData((prev) => {
      if (passengerIndex !== null) {
        const newPassengers = [...prev.passengers];
        newPassengers[passengerIndex][field] = value;
        return { ...prev, passengers: newPassengers };
      }
      return { ...prev, [field]: value };
    });

    // Clear error for this field
    if (passengerIndex !== null) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[
          `passenger${passengerIndex}${
            field.charAt(0).toUpperCase() + field.slice(1)
          }`
        ];
        return newErrors;
      });
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      } else {
        // Scroll to first error
        const firstError = document.querySelector(".error-message");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);

      // Generate booking reference
      const bookingRef = `SKY${Date.now().toString().slice(-8)}`;

      // Save booking to localStorage
      const booking = {
        id: bookingRef,
        flight,
        passengers: formData.passengers,
        contact: {
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
        total: grandTotal,
        date: new Date().toISOString(),
        status: "confirmed",
      };

      localStorage.setItem("lastBooking", JSON.stringify(booking));

      // Navigate to confirmation after 3 seconds
      setTimeout(() => {
        navigate(`/confirmation/${bookingRef}`);
      }, 3000);
    }, 2000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-600 to-secondary-600 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl">
          <div className="text-green-500 text-6xl mb-6 animate-pulse">
            <FaCheckCircle />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your booking is being confirmed. You'll be redirected to your
            booking confirmation shortly.
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-[loading_3s_linear_forwards]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-600 to-secondary-600 p-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-2xl max-w-7xl mx-auto">
        <button
          className="flex items-center text-primary-600 font-semibold mb-4 hover:text-primary-700 transition-colors"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Back to Search
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Complete Your Booking
        </h1>

        {/* Steps */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-2">
          <div
            className={`flex items-center ${
              step >= 1 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                step >= 1
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <span className="font-semibold">Passenger Details</span>
          </div>

          <div className="hidden md:block w-12 h-0.5 bg-gray-300"></div>

          <div
            className={`flex items-center ${
              step >= 2 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                step >= 2
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
            <span className="font-semibold">Payment</span>
          </div>

          <div className="hidden md:block w-12 h-0.5 bg-gray-300"></div>

          <div
            className={`flex items-center ${
              step >= 3 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                step >= 3
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
            <span className="font-semibold">Confirmation</span>
          </div>
        </div>
      </div>

      {/* Error Summary Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="max-w-7xl mx-auto mb-6 animate-fade-in">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-lg">
            <div className="flex items-start">
              <FaExclamationCircle className="text-red-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">
                  Please fix the following errors:
                </h3>
                <ul className="list-disc list-inside text-red-700 text-sm">
                  {Array.from(new Set(Object.values(errors)))
                    .slice(0, 3)
                    .map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  {Array.from(new Set(Object.values(errors))).length > 3 && (
                    <li>
                      ... and{" "}
                      {Array.from(new Set(Object.values(errors))).length - 3}{" "}
                      more
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <form onSubmit={handleSubmit} noValidate>
              {/* Step 1: Passenger Details */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Passenger Details
                    </h2>
                    <span className="text-sm text-gray-600">
                      * Required fields
                    </span>
                  </div>

                  {formData.passengers.map((passenger, index) => (
                    <div key={index} className="mb-8 last:mb-0">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <FaUser className="text-primary-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Passenger {index + 1}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={passenger.firstName}
                            onChange={(e) =>
                              handleInputChange(
                                "passengers",
                                "firstName",
                                e.target.value,
                                index
                              )
                            }
                            className={`input-field ${
                              errors[`passenger${index}FirstName`]
                                ? "border-red-500"
                                : ""
                            }`}
                            required
                          />
                          {errors[`passenger${index}FirstName`] && (
                            <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                              <FaExclamationCircle className="mr-1" />{" "}
                              {errors[`passenger${index}FirstName`]}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={passenger.lastName}
                            onChange={(e) =>
                              handleInputChange(
                                "passengers",
                                "lastName",
                                e.target.value,
                                index
                              )
                            }
                            className={`input-field ${
                              errors[`passenger${index}LastName`]
                                ? "border-red-500"
                                : ""
                            }`}
                            required
                          />
                          {errors[`passenger${index}LastName`] && (
                            <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                              <FaExclamationCircle className="mr-1" />{" "}
                              {errors[`passenger${index}LastName`]}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaEnvelope className="inline mr-2" /> Email *
                          </label>
                          <input
                            type="email"
                            value={passenger.email}
                            onChange={(e) =>
                              handleInputChange(
                                "passengers",
                                "email",
                                e.target.value,
                                index
                              )
                            }
                            className={`input-field ${
                              errors[`passenger${index}Email`]
                                ? "border-red-500"
                                : ""
                            }`}
                            required
                          />
                          {errors[`passenger${index}Email`] && (
                            <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                              <FaExclamationCircle className="mr-1" />{" "}
                              {errors[`passenger${index}Email`]}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaPhone className="inline mr-2" /> Phone *
                          </label>
                          <input
                            type="tel"
                            value={passenger.phone}
                            onChange={(e) =>
                              handleInputChange(
                                "passengers",
                                "phone",
                                e.target.value,
                                index
                              )
                            }
                            className={`input-field ${
                              errors[`passenger${index}Phone`]
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder="+1 (555) 123-4567"
                            required
                          />
                          {errors[`passenger${index}Phone`] && (
                            <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                              <FaExclamationCircle className="mr-1" />{" "}
                              {errors[`passenger${index}Phone`]}
                            </p>
                          )}
                        </div>

                        {/* Passport */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaPassport className="inline mr-2" /> Passport
                            Number *
                          </label>
                          <input
                            type="text"
                            value={passenger.passportNumber}
                            onChange={(e) =>
                              handleInputChange(
                                "passengers",
                                "passportNumber",
                                e.target.value,
                                index
                              )
                            }
                            className={`input-field ${
                              errors[`passenger${index}Passport`]
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder="A12345678"
                            required
                          />
                          {errors[`passenger${index}Passport`] && (
                            <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                              <FaExclamationCircle className="mr-1" />{" "}
                              {errors[`passenger${index}Passport`]}
                            </p>
                          )}
                        </div>

                        {/* Nationality */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nationality *
                          </label>
                          <select
                            value={passenger.nationality}
                            onChange={(e) =>
                              handleInputChange(
                                "passengers",
                                "nationality",
                                e.target.value,
                                index
                              )
                            }
                            className={`input-field ${
                              errors[`passenger${index}Nationality`]
                                ? "border-red-500"
                                : ""
                            }`}
                            required
                          >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                          </select>
                          {errors[`passenger${index}Nationality`] && (
                            <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                              <FaExclamationCircle className="mr-1" />{" "}
                              {errors[`passenger${index}Nationality`]}
                            </p>
                          )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaCalendarAlt className="inline mr-2" /> Date of
                            Birth *
                          </label>
                          <input
                            type="date"
                            value={passenger.dateOfBirth}
                            onChange={(e) =>
                              handleInputChange(
                                "passengers",
                                "dateOfBirth",
                                e.target.value,
                                index
                              )
                            }
                            className={`input-field ${
                              errors[`passenger${index}DOB`]
                                ? "border-red-500"
                                : ""
                            }`}
                            max={new Date().toISOString().split("T")[0]}
                            required
                          />
                          {errors[`passenger${index}DOB`] && (
                            <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                              <FaExclamationCircle className="mr-1" />{" "}
                              {errors[`passenger${index}DOB`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Contact Information */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Contact Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaEnvelope className="inline mr-2" /> Contact Email *
                        </label>
                        <input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) =>
                            handleInputChange(
                              "contact",
                              "contactEmail",
                              e.target.value
                            )
                          }
                          className={`input-field ${
                            errors.contactEmail ? "border-red-500" : ""
                          }`}
                          required
                        />
                        {errors.contactEmail && (
                          <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                            <FaExclamationCircle className="mr-1" />{" "}
                            {errors.contactEmail}
                          </p>
                        )}
                      </div>

                      {/* Contact Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaPhone className="inline mr-2" /> Contact Phone *
                        </label>
                        <input
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) =>
                            handleInputChange(
                              "contact",
                              "contactPhone",
                              e.target.value
                            )
                          }
                          className={`input-field ${
                            errors.contactPhone ? "border-red-500" : ""
                          }`}
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                        {errors.contactPhone && (
                          <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                            <FaExclamationCircle className="mr-1" />{" "}
                            {errors.contactPhone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      className="btn-primary px-8"
                      onClick={handleNextStep}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Payment Details
                    </h2>
                    <span className="text-sm text-gray-600">
                      * Required fields
                    </span>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Select Payment Method
                    </h3>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        className="flex-1 p-4 border-2 border-primary-500 rounded-xl bg-primary-50 flex flex-col items-center"
                      >
                        <FaCreditCard className="text-2xl text-primary-600 mb-2" />
                        <span className="font-semibold text-gray-800">
                          Credit/Debit Card
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "cardNumber",
                            e.target.value
                          )
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className={`input-field ${
                          errors.cardNumber ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {errors.cardNumber && (
                        <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                          <FaExclamationCircle className="mr-1" />{" "}
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    {/* Card Holder */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Holder Name *
                      </label>
                      <input
                        type="text"
                        value={formData.cardHolder}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "cardHolder",
                            e.target.value
                          )
                        }
                        placeholder="John Doe"
                        className={`input-field ${
                          errors.cardHolder ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {errors.cardHolder && (
                        <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                          <FaExclamationCircle className="mr-1" />{" "}
                          {errors.cardHolder}
                        </p>
                      )}
                    </div>

                    {/* Expiry Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date (MM/YY) *
                      </label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "expiryDate",
                            e.target.value
                          )
                        }
                        placeholder="MM/YY"
                        maxLength="5"
                        className={`input-field ${
                          errors.expiryDate ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {errors.expiryDate && (
                        <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                          <FaExclamationCircle className="mr-1" />{" "}
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>

                    {/* CVV */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) =>
                          handleInputChange("payment", "cvv", e.target.value)
                        }
                        placeholder="123"
                        maxLength="4"
                        className={`input-field ${
                          errors.cvv ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {errors.cvv && (
                        <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                          <FaExclamationCircle className="mr-1" /> {errors.cvv}
                        </p>
                      )}
                    </div>

                    {/* Billing Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing Address *
                      </label>
                      <input
                        type="text"
                        value={formData.billingAddress}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "billingAddress",
                            e.target.value
                          )
                        }
                        placeholder="123 Main St, City, State, ZIP, Country"
                        className={`input-field ${
                          errors.billingAddress ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {errors.billingAddress && (
                        <p className="error-message mt-2 text-sm text-red-600 flex items-center">
                          <FaExclamationCircle className="mr-1" />{" "}
                          {errors.billingAddress}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Extras */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Add Extras
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Baggage
                          </h4>
                          <p className="text-sm text-gray-600">
                            Standard: 1 cabin bag (7kg) • Extra: +1 checked bag
                            (23kg)
                          </p>
                        </div>
                        <select
                          value={formData.baggage}
                          onChange={(e) =>
                            handleInputChange(
                              "extras",
                              "baggage",
                              e.target.value
                            )
                          }
                          className="input-field w-48"
                        >
                          <option value="standard">Standard (Free)</option>
                          <option value="extra">Extra Bag (+$30)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Travel Insurance
                          </h4>
                          <p className="text-sm text-gray-600">
                            Covers trip cancellation, medical emergencies, and
                            lost baggage
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-green-600">
                            +$15
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.insurance}
                              onChange={(e) =>
                                handleInputChange(
                                  "extras",
                                  "insurance",
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Seat Selection
                          </h4>
                          <p className="text-sm text-gray-600">
                            Choose specific seat or let us assign the best
                            available
                          </p>
                        </div>
                        <select
                          value={formData.seatSelection}
                          onChange={(e) =>
                            handleInputChange(
                              "extras",
                              "seatSelection",
                              e.target.value
                            )
                          }
                          className="input-field w-48"
                        >
                          <option value="auto">Auto Assign (Free)</option>
                          <option value="window">Window Seat (+$10)</option>
                          <option value="aisle">Aisle Seat (+$10)</option>
                          <option value="extra">Extra Legroom (+$25)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between">
                      <FaLock className="text-2xl" />
                      <div className="text-center">
                        <h4 className="font-bold text-lg mb-2">
                          Secure Payment
                        </h4>
                        <p className="text-white/90">
                          Your payment information is encrypted and secure. We
                          use 256-bit SSL encryption.
                        </p>
                      </div>
                      <FaShieldAlt className="text-2xl" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `Pay $${grandTotal.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Flight Summary
                </h3>
                <div className="text-right">
                  <span className="text-3xl font-bold text-primary-600">
                    ${grandTotal.toFixed(2)}
                  </span>
                  <div className="text-sm text-gray-600">Total Amount</div>
                </div>
              </div>

              {/* Flight Route */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {flight.origin}
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.originCity || "New York"}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                      <FaPlane className="mx-2 text-primary-500" />
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaClock className="mr-2 text-primary-500" />
                      <span className="font-semibold">
                        {(flight.duration / 60).toFixed(1)}h
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {flight.destination}
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.destinationCity || "Los Angeles"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Airline</span>
                    <span className="font-semibold">{flight.airline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight</span>
                    <span className="font-semibold">{flight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure</span>
                    <span className="font-semibold">
                      {formatDate(flight.departureTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrival</span>
                    <span className="font-semibold">
                      {formatDate(flight.arrivalTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class</span>
                    <span className="font-semibold">
                      {flight.travelClass || "Economy"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Price Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Flight × {passengerCount}</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  {baggageFee > 0 && (
                    <div className="flex justify-between">
                      <span>Extra Baggage</span>
                      <span className="text-green-600">
                        +${baggageFee.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {insuranceFee > 0 && (
                    <div className="flex justify-between">
                      <span>Travel Insurance</span>
                      <span className="text-green-600">
                        +${insuranceFee.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span className="text-gray-600">+${taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <FaShieldAlt className="text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-800">
                      Best Price Guarantee
                    </div>
                    <div className="text-sm text-gray-600">
                      Found a lower price? We'll match it.
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <FaShieldAlt className="text-blue-600 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-800">
                      24/7 Support
                    </div>
                    <div className="text-sm text-gray-600">
                      Customer support available anytime.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
