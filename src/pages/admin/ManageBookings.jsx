import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUserTie, FaCalendar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import useAxios from '../../hooks/useAxios';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('all');
  const [paidFilter, setPaidFilter] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDecorator, setSelectedDecorator] = useState('');

  // Fetch bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['adminBookings', statusFilter, paidFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (paidFilter !== 'all') params.append('paid', paidFilter);
      
      const response = await axiosSecure.get(`/admin/bookings?${params.toString()}`);
      return response.data;
    }
  });

  // Fetch active decorators
  const { data: decorators = [] } = useQuery({
    queryKey: ['activeDecorators'],
    queryFn: async () => {
      const response = await axiosSecure.get('/admin/decorators/active');
      return response.data;
    }
  });

  // Assign decorator mutation
  const assignDecoratorMutation = useMutation({
    mutationFn: async ({ bookingId, decoratorEmail, decoratorName }) => {
      return await axiosSecure.patch(`/admin/bookings/${bookingId}/assign-decorator`, {
        decoratorEmail,
        decoratorName
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBookings']);
      toast.success('Decorator assigned successfully');
      setShowAssignModal(false);
      setSelectedBooking(null);
      setSelectedDecorator('');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to assign decorator';
      toast.error(message);
    }
  });

  const handleAssignClick = (booking) => {
    if (!booking.paid) {
      toast.error('Cannot assign decorator. Payment not completed yet.');
      return;
    }
    setSelectedBooking(booking);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDecorator) {
      toast.error('Please select a decorator');
      return;
    }

    const decorator = decorators.find(d => d.email === selectedDecorator);
    
    assignDecoratorMutation.mutate({
      bookingId: selectedBooking._id,
      decoratorEmail: decorator.email,
      decoratorName: decorator.name
    });
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Manage Bookings</h1>
        <p className="text-base-content/60 mt-2">
          View all bookings and assign decorators
        </p>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-xl mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Filter by Status</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Filter by Payment</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={paidFilter}
              onChange={(e) => setPaidFilter(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="true">Paid Only</option>
              <option value="false">Unpaid Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value text-primary">{bookings.length}</div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Service</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Location</th>
              <th>Cost</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Decorator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="font-semibold">{booking.serviceName}</td>
                <td>
                  <div>
                    <div className="font-bold">{booking.userName}</div>
                    <div className="text-sm text-base-content/60">{booking.userEmail}</div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-primary" />
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span className="truncate max-w-[150px]">{booking.location}</span>
                  </div>
                </td>
                <td className="font-bold">৳{booking.totalCost?.toLocaleString() || 0}</td>
                <td>
                  <span className={`badge ${booking.paid ? 'badge-success' : 'badge-warning'}`}>
                    {booking.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    booking.status === 'confirmed' ? 'badge-success' : 
                    booking.status === 'pending' ? 'badge-warning' : 'badge-error'
                  } capitalize`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  {booking.assignedDecoratorName ? (
                    <span className="badge badge-info">
                      {booking.assignedDecoratorName}
                    </span>
                  ) : (
                    <span className="badge badge-ghost">Not Assigned</span>
                  )}
                </td>
                <td>
                  {!booking.assignedDecoratorEmail && (
                    <button
                      onClick={() => handleAssignClick(booking)}
                      className={`btn btn-sm ${
                        booking.paid ? 'btn-secondary' : 'btn-disabled'
                      }`}
                      disabled={!booking.paid}
                      title={!booking.paid ? 'Payment required to assign decorator' : 'Assign decorator'}
                    >
                      <FaUserTie />
                    </button>
                  )}
                  {booking.assignedDecoratorEmail && (
                    <span className="text-sm text-success">✓ Assigned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-base-content/60">No bookings found</p>
          </div>
        )}
      </div>

      {/* Assign Decorator Modal */}
      {showAssignModal && selectedBooking && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-4">Assign Decorator</h3>

            <div className="mb-4 p-4 bg-base-200 rounded-lg">
              <p className="text-sm text-base-content/60 mb-1">Service</p>
              <p className="font-bold">{selectedBooking.serviceName}</p>
              <p className="text-sm text-base-content/60 mt-2">Customer</p>
              <p>{selectedBooking.userName}</p>
              <p className="text-sm text-base-content/60 mt-2">Date</p>
              <p>{new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
            </div>

            <form onSubmit={handleAssignSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Select Decorator*</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedDecorator}
                  onChange={(e) => setSelectedDecorator(e.target.value)}
                  required
                >
                  <option value="">Choose a decorator...</option>
                  {decorators.map((decorator) => (
                    <option key={decorator._id} value={decorator.email}>
                      {decorator.name} - {decorator.decoratorInfo?.specialties?.join(', ') || 'General'}
                    </option>
                  ))}
                </select>
              </div>

              {decorators.length === 0 && (
                <div className="alert alert-warning mt-4">
                  <span>No active decorators available</span>
                </div>
              )}

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedBooking(null);
                    setSelectedDecorator('');
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={assignDecoratorMutation.isPending || decorators.length === 0}
                >
                  {assignDecoratorMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Assigning...
                    </>
                  ) : (
                    'Assign Decorator'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;