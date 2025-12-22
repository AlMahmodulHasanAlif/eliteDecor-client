import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Cancelled
        </h2>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. Your booking is still pending.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard/my-bookings')}
            className="btn btn-primary w-full"
          >
            Back to My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-outline w-full"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;