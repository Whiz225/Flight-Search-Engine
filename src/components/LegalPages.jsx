import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaShieldAlt,
  FaFileContract,
  FaEnvelope,
  FaQuestionCircle,
  FaLock,
  FaUserCheck,
  FaGlobe,
  FaCog,
} from "react-icons/fa";

const LegalPages = ({ page }) => {
  const navigate = useNavigate();

  const getPageContent = () => {
    switch (page) {
      case "privacy":
        return {
          title: "Privacy Policy",
          icon: <FaLock className="text-4xl text-primary-600" />,
          lastUpdated: "January 15, 2026",
          content: privacyPolicyContent,
        };
      case "terms":
        return {
          title: "Terms of Service",
          icon: <FaFileContract className="text-4xl text-primary-600" />,
          lastUpdated: "January 15, 2026",
          content: termsOfServiceContent,
        };
      case "contact":
        return {
          title: "Contact Us",
          icon: <FaEnvelope className="text-4xl text-primary-600" />,
          lastUpdated: null,
          content: contactUsContent,
        };
      case "help":
        return {
          title: "Help Center",
          icon: <FaQuestionCircle className="text-4xl text-primary-600" />,
          lastUpdated: null,
          content: helpCenterContent,
        };
      default:
        return {
          title: "Page Not Found",
          icon: <FaQuestionCircle className="text-4xl text-primary-600" />,
          lastUpdated: null,
          content: [],
        };
    }
  };

  const { title, icon, lastUpdated, content } = getPageContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-600 to-secondary-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white mb-4 hover:text-white/80 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="mr-4">{icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                {lastUpdated && (
                  <p className="text-gray-600">Last updated: {lastUpdated}</p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {content.map((section, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    {section.icon && (
                      <span className="mr-3">{section.icon}</span>
                    )}
                    {section.title}
                  </h2>
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-3">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="text-gray-600">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">{section.content}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Form for Contact Page */}
            {page === "contact" && (
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Send us a message
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      className="input-field min-h-[150px]"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    Send Message
                  </button>
                </form>
              </div>
            )}

            {/* FAQ for Help Center */}
            {page === "help" && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqItems.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center">
                        <span className="font-medium text-gray-800">
                          {faq.question}
                        </span>
                        <span className="text-primary-600">+</span>
                      </button>
                      <div className="p-4 bg-white">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Privacy Policy Content
const privacyPolicyContent = [
  {
    title: "Information We Collect",
    icon: <FaUserCheck />,
    content: [
      "Personal information (name, email, phone number) when you create an account or make a booking",
      "Flight search and booking history",
      "Payment information (processed securely through our payment partners)",
      "Device and browser information for analytics",
      "Location data to provide relevant flight options",
    ],
  },
  {
    title: "How We Use Your Information",
    icon: <FaCog />,
    content: [
      "Process your flight bookings and payments",
      "Send booking confirmations and travel updates",
      "Improve our services and user experience",
      "Send promotional offers (you can opt out anytime)",
      "Comply with legal requirements",
    ],
  },
  {
    title: "Data Security",
    icon: <FaShieldAlt />,
    content: [
      "We use 256-bit SSL encryption for all data transmission",
      "Regular security audits and vulnerability assessments",
      "Access controls and authentication protocols",
      "Data is stored on secure, encrypted servers",
      "Regular backups and disaster recovery procedures",
    ],
  },
  {
    title: "Your Rights",
    icon: <FaUserCheck />,
    content: [
      "Access your personal data we hold",
      "Request correction of inaccurate data",
      "Request deletion of your data (subject to legal requirements)",
      "Opt out of marketing communications",
      "Export your data in a portable format",
    ],
  },
];

// Terms of Service Content
const termsOfServiceContent = [
  {
    title: "Acceptance of Terms",
    icon: <FaFileContract />,
    content:
      "By accessing and using SkySearch Flight Engine, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
  },
  {
    title: "Booking and Payments",
    icon: <FaLock />,
    content: [
      "All flight bookings are subject to airline terms and conditions",
      "Prices are subject to change until booking is confirmed",
      "Payment must be completed in full at time of booking",
      "Cancellation and refund policies vary by airline",
      "We are not responsible for airline schedule changes or cancellations",
    ],
  },
  {
    title: "User Responsibilities",
    icon: <FaUserCheck />,
    content: [
      "Provide accurate and complete information for bookings",
      "Ensure passport and travel documents are valid",
      "Arrive at airport with sufficient time for check-in",
      "Comply with airline baggage policies",
      "Follow all applicable laws and regulations",
    ],
  },
  {
    title: "Limitation of Liability",
    icon: <FaShieldAlt />,
    content:
      "SkySearch Flight Engine is not liable for any direct, indirect, incidental, or consequential damages arising from your use of our services, including but not limited to flight delays, cancellations, or lost baggage.",
  },
];

// Contact Us Content
const contactUsContent = [
  {
    title: "Customer Support",
    icon: <FaEnvelope />,
    content: [
      "Email: support@skysearch.com",
      "Phone: +1 (800) 555-1234",
      "Live Chat: Available 24/7 on our website",
      "Response Time: Within 2 hours during business hours",
    ],
  },
  {
    title: "Business Hours",
    icon: <FaCog />,
    content: [
      "Monday - Friday: 6:00 AM - 12:00 AM EST",
      "Saturday - Sunday: 8:00 AM - 10:00 PM EST",
      "Holidays: Limited support available",
    ],
  },
  {
    title: "Mailing Address",
    icon: <FaGlobe />,
    content:
      "SkySearch Flight Engine\n123 Aviation Way\nNew York, NY 10001\nUnited States",
  },
];

// Help Center Content
const helpCenterContent = [
  {
    title: "Getting Started",
    icon: <FaQuestionCircle />,
    content: [
      "How to search for flights",
      "Creating and managing your account",
      "Understanding flight prices and fees",
      "Payment methods accepted",
    ],
  },
  {
    title: "Booking Management",
    icon: <FaFileContract />,
    content: [
      "How to modify or cancel a booking",
      "Check-in procedures",
      "Baggage policies and fees",
      "Special requests and accommodations",
    ],
  },
  {
    title: "Technical Support",
    icon: <FaCog />,
    content: [
      "Troubleshooting login issues",
      "Payment processing problems",
      "Website accessibility features",
      "Mobile app download and setup",
    ],
  },
];

// FAQ Items
const faqItems = [
  {
    question: "How do I change or cancel my flight booking?",
    answer:
      'You can modify or cancel your booking through "My Bookings" section. Please note that changes and cancellations are subject to airline policies and may incur fees.',
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All payments are processed securely.",
  },
  {
    question: "How do I check in for my flight?",
    answer:
      "Online check-in opens 24 hours before departure. You can check in through our website, mobile app, or directly with the airline. Boarding passes can be printed or saved to your mobile device.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Refund eligibility depends on the airline's policy and fare type. Basic economy tickets are typically non-refundable. Refunds for eligible tickets are processed within 7-10 business days.",
  },
  {
    question: "How can I add baggage to my booking?",
    answer:
      'You can add baggage during the booking process or later through "Manage Booking". Baggage fees vary by airline and route.',
  },
];

export default LegalPages;
