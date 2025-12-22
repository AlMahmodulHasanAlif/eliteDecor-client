import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import useAxios from '../../hooks/useAxios';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const [verifying, setVerifying] = useState(true);

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (!sessionId || !bookingId) {
      navigate('/dashboard/my-bookings');
      return;
    }

    // Verify payment
    axiosSecure
      .post('/verify-payment', { sessionId, bookingId })
      .then(() => {
        toast.success('Payment successful!');
        setVerifying(false);
        setTimeout(() => {
          navigate('/dashboard/my-bookings');
        }, 3000);
      })
      .catch((error) => {
        console.error('Verification error:', error);
        toast.error('Payment verification failed');
        setVerifying(false);
      });
  }, [sessionId, bookingId, axiosSecure, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {verifying ? (
          <>
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verifying Payment...
            </h2>
            <p className="text-gray-600">Please wait while we confirm your payment</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed and paid
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                Redirecting to your bookings in a moment...
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/my-bookings')}
              className="btn btn-primary w-full"
            >
              View My Bookings
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;