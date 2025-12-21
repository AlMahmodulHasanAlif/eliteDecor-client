// src/pages/ServiceDetails.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    bookingDate: "",
    location: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch service details
  const {
    data: service,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/services/${id}`);
      return res.data;
    },
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      toast.error("Please login to book a service");
      navigate("/login");
      return;
    }

    // Validate form
    if (!bookingData.bookingDate || !bookingData.location) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    const booking = {
      userEmail: user.email,
      userName: user.displayName,
      serviceId: service._id,
      serviceName: service.service_name,
      bookingDate: bookingData.bookingDate,
      location: bookingData.location,
      totalCost: service.cost,
      status: "pending",
      paymentStatus: "pending",
    };

    const res = await axiosSecure.post("/bookings", booking);

    if (res.data) {
      toast.success("Booking created successfully! Please complete payment.");
      setShowModal(false);
      navigate("/dashboard/my-bookings");
    }

    setSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service not found</h2>
          <Link to="/services" className="btn btn-primary">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/services" className="btn btn-ghost mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Services
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <figure className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={
                  service.image ||
                  "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800"
                }
                alt={service.service_name}
                className="w-full h-[500px] object-cover"
              />
            </figure>
          </div>

          {/* Details Section */}
          <div>
            {/* Category Badge */}
            <div className="badge badge-primary badge-lg mb-4 capitalize">
              {service.service_category}
            </div>

            {/* Service Name */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {service.service_name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <p className="text-5xl font-bold text-primary">
                ৳{Number(service.cost || 0).toLocaleString()}
              </p>
              <p className="text-xl text-base-content/60">/ {service.unit}</p>
            </div>

            <div className="divider"></div>

            {/* Description */}
            <h3 className="text-2xl font-semibold mb-3">Description</h3>
            <p className="text-base-content/70 text-lg leading-relaxed mb-6">
              {service.description}
            </p>
            <div className="divider"></div>

            {/* Description */}
            <h3 className="text-2xl font-semibold mb-3">Features</h3>
            <p className="text-base-content/70 text-lg leading-relaxed mb-6">
              {service.features}
            </p>

            <div className="divider"></div>

            {/* Features */}
            <h3 className="text-2xl font-semibold mb-4">What's Included</h3>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-primary text-xl" />
                <p className="text-lg">Professional decorators</p>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-primary text-xl" />
                <p className="text-lg">Quality materials</p>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-primary text-xl" />
                <p className="text-lg">On-time delivery</p>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-primary text-xl" />
                <p className="text-lg">Customer satisfaction guaranteed</p>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary btn-lg w-full"
            >
              Book Now
            </button>

            {/* Created By */}
            <p className="text-sm text-base-content/60 mt-4 text-center">
              Created by: {service.createdByEmail}
            </p>
          </div>
        </div>

        {/* Booking Modal */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-md">
              <h3 className="font-bold text-2xl mb-4">
                Book {service.service_name}
              </h3>

              <form onSubmit={handleBookingSubmit}>
                {/* User Email (Pre-filled) */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Your Email</span>
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    className="input input-bordered"
                    disabled
                  />
                </div>

                {/* User Name (Pre-filled) */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Your Name</span>
                  </label>
                  <input
                    type="text"
                    value={user?.displayName || ""}
                    className="input input-bordered"
                    disabled
                  />
                </div>

                {/* Service Name (Pre-filled) */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Service</span>
                  </label>
                  <input
                    type="text"
                    value={service.service_name}
                    className="input input-bordered"
                    disabled
                  />
                </div>

                {/* Booking Date */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Booking Date*
                    </span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={bookingData.bookingDate}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        bookingDate: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                {/* Location */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Location*</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Enter your full address"
                    value={bookingData.location}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        location: e.target.value,
                      })
                    }
                    required
                  ></textarea>
                </div>

                {/* Total Cost Info */}
                <div className="alert alert-info mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold">
                      Total Cost: ৳{Number(service.cost || 0).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      You can pay after booking confirmation
                    </p>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Creating...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
