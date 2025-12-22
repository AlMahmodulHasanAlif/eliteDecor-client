import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaCalendar, FaMapMarkerAlt, FaClock, FaInfoCircle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch user bookings with auto-refetch
  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ["myBookings", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/bookings/user/${user?.email}`
      );
      return response.data;
    },
    enabled: !!user?.email,
    refetchInterval: 10000, // Auto refetch every 10 seconds
    refetchOnWindowFocus: true,
  });

  // Delete booking mutation
  const deleteMutation = useMutation({
    mutationFn: async (bookingId) => {
      return await axiosSecure.delete(`/bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myBookings"]);
      toast.success("Booking cancelled successfully");
    },
    onError: () => {
      toast.error("Failed to cancel booking");
    },
  });

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      deleteMutation.mutate(bookingId);
    }
  };

  const handlePayment = async (booking) => {
    setLoading(true);
    try {
      const response = await axiosSecure.post("/create-checkout-session", {
        booking: {
          _id: booking._id,
          serviceName: booking.serviceName,
          totalCost: booking.totalCost,
          bookingDate: booking.bookingDate,
          location: booking.location,
          userEmail: booking.userEmail,
        },
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Payment session failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment");
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      confirmed: "badge-info",
      "in-progress": "badge-primary",
      completed: "badge-success",
      cancelled: "badge-error",
    };
    return badges[status] || "badge-ghost";
  };

  const getProjectStatusInfo = (projectStatus) => {
    const statusInfo = {
      "assigned": {
        label: "Assigned",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        icon: "📋",
        description: "Project has been assigned to decorator"
      },
      "planning phase": {
        label: "Planning Phase",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        icon: "📋",
        description: "Decorator is planning your design"
      },
      "materials prepared": {
        label: "Materials Prepared",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        icon: "📦",
        description: "Materials are ready for decoration"
      },
      "on the way to venue": {
        label: "On The Way",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        icon: "🚗",
        description: "Decorator is heading to your location"
      },
      "setup in progress": {
        label: "Setup In Progress",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        icon: "🔨",
        description: "Decoration work in progress"
      },
      "completed": {
        label: "Completed",
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: "✅",
        description: "Project completed successfully"
      }
    };
    return statusInfo[projectStatus] || {
      label: "Not Started",
      color: "text-gray-500",
      bgColor: "bg-gray-100",
      icon: "⏸️",
      description: "Waiting to start"
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">My Bookings</h1>
          <p className="text-base-content/60 mt-2">
            View and manage your decoration service bookings
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn btn-primary btn-sm gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value text-primary">{bookings.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">
            {bookings.filter((b) => b.status === "pending").length}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">
            {bookings.filter((b) => b.projectStatus === "completed").length}
          </div>
        </div>
      </div>

      {/* Booking List */}
      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-lg shadow">
          <h3 className="text-2xl font-bold mb-4">No Bookings Yet</h3>
          <p className="text-base-content/60 mb-6">
            You haven't made any bookings yet.
          </p>
          <a href="/services" className="btn btn-primary">
            Browse Services
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const projectInfo = getProjectStatusInfo(booking.projectStatus);
            
            return (
              <div
                key={booking._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="card-body">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h3 className="card-title text-xl">
                        {booking.serviceName}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        <span
                          className={`badge ${getStatusBadge(booking.status)}`}
                        >
                          {booking.status || "pending"}
                        </span>
                        {booking.paid ? (
                          <span className="badge badge-success">Paid</span>
                        ) : (
                          <span className="badge badge-warning">Unpaid</span>
                        )}
                      </div>
                    </div>

                    {/* Project Status Alert - Show if exists */}
                    {booking.projectStatus && (
                      <div className={`${projectInfo.bgColor} ${projectInfo.color} rounded-lg p-4`}>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{projectInfo.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-lg">
                              {projectInfo.label}
                            </p>
                            <p className="text-sm opacity-90 mt-1">
                              {projectInfo.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                      {/* Left - Details */}
                      <div className="flex-1">
                        <div className="space-y-2 text-base-content/70">
                          <div className="flex items-center gap-2">
                            <FaCalendar />
                            <span className="font-medium">Booking Date:</span>
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt />
                            <span className="font-medium">Location:</span>
                            {booking.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock />
                            <span className="font-medium">Booked On:</span>
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="divider my-2"></div>

                        <p className="text-2xl font-bold text-primary">
                          ৳{Number(booking.totalCost).toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 w-full lg:w-48">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="btn btn-info btn-sm"
                        >
                          <FaInfoCircle /> View Details
                        </button>

                        {!booking.paid && booking.status === "pending" && (
                          <button
                            onClick={() => handlePayment(booking)}
                            className="btn btn-success btn-sm"
                            disabled={loading}
                          >
                            {loading ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Pay Now"
                            )}
                          </button>
                        )}

                        {booking.status === "pending" && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="btn btn-error btn-sm"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <>
                                <FaTrash /> Cancel
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedBooking && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-2xl mb-4">Booking Details</h3>
            
            {/* Project Status Timeline */}
            {selectedBooking.projectStatus && (
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-3">Project Progress</h4>
                <div className="bg-base-200 rounded-lg p-4">
                  {(() => {
                    const info = getProjectStatusInfo(selectedBooking.projectStatus);
                    return (
                      <div className={`${info.bgColor} ${info.color} rounded-lg p-4`}>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{info.icon}</span>
                          <div>
                            <p className="font-bold text-lg">{info.label}</p>
                            <p className="text-sm opacity-90">{info.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Service Info */}
              <div className="bg-base-200 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Service Information</h4>
                <p><span className="font-medium">Service:</span> {selectedBooking.serviceName}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`badge ${getStatusBadge(selectedBooking.status)} ml-2`}>
                    {selectedBooking.status}
                  </span>
                </p>
              </div>

              {/* Booking Info */}
              <div className="bg-base-200 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Information</h4>
                <p><span className="font-medium">Date:</span> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Location:</span> {selectedBooking.location}</p>
                <p><span className="font-medium">Booked On:</span> {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Payment Info */}
              <div className="bg-base-200 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Payment Information</h4>
                <p><span className="font-medium">Total Cost:</span> ৳{selectedBooking.totalCost.toLocaleString()}</p>
                <p><span className="font-medium">Payment Status:</span> 
                  <span className={`badge ${selectedBooking.paid ? 'badge-success' : 'badge-warning'} ml-2`}>
                    {selectedBooking.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </p>
                {selectedBooking.transactionId && (
                  <p><span className="font-medium">Transaction ID:</span> {selectedBooking.transactionId}</p>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button onClick={() => setSelectedBooking(null)} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;