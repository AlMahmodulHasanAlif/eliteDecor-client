import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaCalendar, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  // Fetch user bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["myBookings", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/bookings/user/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email,
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      confirmed: "badge-success",
      cancelled: "badge-error",
    };
    return badges[status] || "badge-ghost";
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
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">My Bookings</h1>
        <p className="text-base-content/60 mt-2">
          View and manage your decoration service bookings
        </p>
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

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-lg shadow">
          <h3 className="text-2xl font-bold mb-4">No Bookings Yet</h3>
          <p className="text-base-content/60 mb-6">
            You haven't made any bookings. Browse our services to get started!
          </p>
          <a href="/services" className="btn btn-primary">
            Browse Services
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="card-title text-xl">
                        {booking.serviceName}
                      </h3>
                      <div className="flex gap-2">
                        <span
                          className={`badge ${getStatusBadge(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                        {booking.paid ? (
                          <span className="badge badge-success">Paid</span>
                        ) : (
                          <span className="badge badge-warning">Unpaid</span>
                        )}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-2 text-base-content/70">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-primary" />
                        <span>
                          Booking Date:{" "}
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        <span>Location: {booking.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-primary" />
                        <span>
                          Created:{" "}
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-primary">
                        ৳{Number(booking.totalCost || 0).toLocaleString()}
                      </p>
                    </div>

                    {/* Project Status */}
                    {booking.projectStatus && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">
                          Project Status:
                        </p>
                        <div className="badge badge-outline badge-lg capitalize">
                          {booking.projectStatus}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    {!booking.paid && booking.status === "pending" && (
                      <button className="btn btn-success btn-sm">
                        Pay Now
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
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
