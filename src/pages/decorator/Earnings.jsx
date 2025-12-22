import { useQuery } from '@tanstack/react-query';
import { FaDollarSign, FaCheckCircle, FaCalendar } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

const Earnings = () => {
  const { user } = useAuth(); 
  const axiosSecure = useAxios();

  // Fetch earnings
  const { data: earnings = {}, isLoading } = useQuery({
    queryKey: ['decoratorEarnings', user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/decorator/earnings/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email
  });

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
        <h1 className="text-3xl md:text-4xl font-bold">My Earnings</h1>
        <p className="text-base-content/60 mt-2">
          View your completed projects and total earnings
        </p>
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="stat bg-base-100 rounded-lg shadow-xl">
          <div className="stat-figure text-primary">
            <FaDollarSign className="text-5xl" />
          </div>
          <div className="stat-title">Total Earnings</div>
          <div className="stat-value text-primary">
            ৳{earnings.totalEarnings?.toLocaleString() || 0}
          </div>
          <div className="stat-desc">From completed projects</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-xl">
          <div className="stat-figure text-success">
            <FaCheckCircle className="text-5xl" />
          </div>
          <div className="stat-title">Completed Projects</div>
          <div className="stat-value text-success">
            {earnings.totalProjects || 0}
          </div>
          <div className="stat-desc">Successfully completed</div>
        </div>
      </div>

      {/* Completed Projects List */}
      <h2 className="text-2xl font-bold mb-4">Completed Projects</h2>
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Service</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Earnings</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {earnings.completedBookings?.map((project) => (
              <tr key={project._id}>
                <td className="font-semibold">{project.serviceName}</td>
                <td>
                  <div>
                    <div className="font-bold">{project.userName}</div>
                    <div className="text-sm text-base-content/60">{project.userEmail}</div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-primary" />
                    {new Date(project.bookingDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="font-bold text-success">
                  ৳{project.totalCost?.toLocaleString() || 0}
                </td>
                <td>
                  <span className="badge badge-success">
                    <FaCheckCircle className="mr-1" />
                    Completed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!earnings.completedBookings || earnings.completedBookings.length === 0) && (
          <div className="text-center py-12">
            <p className="text-lg text-base-content/60">No completed projects yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Earnings;