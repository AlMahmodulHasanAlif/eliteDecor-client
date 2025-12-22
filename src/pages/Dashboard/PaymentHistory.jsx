import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/user/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
        <p className="text-gray-600 mt-2">
          View all your payment transactions
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Payments Yet
          </h3>
          <p className="text-gray-600">
            Your payment history will appear here once you make a payment.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Service</th>
                  <th className="text-left">Transaction ID</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="font-medium">{index + 1}</td>
                    <td>
                      <div>
                        <p className="font-medium text-gray-800">
                          {payment.serviceName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Booking ID: {payment.bookingId?.slice(-6)}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-mono text-gray-600">
                        {payment.transactionId?.slice(-12)}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold text-gray-800">
                        ৳{payment.amount?.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        {payment.currency}
                      </span>
                    </td>
                    <td className="text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(payment.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success badge-sm">
                        {payment.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      {payments.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-md p-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Payments</p>
              <p className="text-3xl font-bold">{payments.length}</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Total Amount Paid</p>
              <p className="text-3xl font-bold">
                ৳
                {payments
                  .reduce((sum, p) => sum + (p.amount || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Latest Payment</p>
              <p className="text-3xl font-bold">
                {new Date(payments[0]?.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;