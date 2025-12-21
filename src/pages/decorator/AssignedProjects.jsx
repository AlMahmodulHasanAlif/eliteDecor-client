import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaCalendar, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import toast from 'react-hot-toast';

const AssignedProjects = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const projectStatuses = [
    'assigned',
    'planning phase',
    'materials prepared',
    'on the way to venue',
    'setup in progress',
    'completed'
  ];

  // Fetch decorator's projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['decoratorProjects', user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/decorator/bookings/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ projectId, projectStatus }) => {
      return await axiosSecure.patch(`/decorator/bookings/${projectId}/status`, {
        projectStatus
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['decoratorProjects']);
      toast.success('Project status updated successfully');
      setShowStatusModal(false);
      setSelectedProject(null);
      setNewStatus('');
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  const handleUpdateStatus = (project) => {
    setSelectedProject(project);
    setNewStatus(project.projectStatus || 'assigned');
    setShowStatusModal(true);
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    updateStatusMutation.mutate({
      projectId: selectedProject._id,
      projectStatus: newStatus
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Separate today's and other projects
  const today = new Date().toDateString();
  const todaysProjects = projects.filter(
    p => new Date(p.bookingDate).toDateString() === today
  );
  const otherProjects = projects.filter(
    p => new Date(p.bookingDate).toDateString() !== today
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">My Projects</h1>
        <p className="text-base-content/60 mt-2">
          View and manage your assigned decoration projects
        </p>
      </div>

      {/* Stats */}
      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Total Projects</div>
          <div className="stat-value text-primary">{projects.length}</div>
        </div>
      </div>

      {/* Today's Schedule */}
      {todaysProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {todaysProjects.map((project) => (
              <div key={project._id} className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="card-title text-xl">{project.serviceName}</h3>
                      
                      <div className="space-y-2 text-base-content/70 mt-3">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-primary" />
                          <span>{new Date(project.bookingDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-primary" />
                          <span>{project.location}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-semibold mb-1">Customer:</p>
                        <p>{project.userName}</p>
                        <p className="text-sm text-base-content/60">{project.userEmail}</p>
                      </div>

                      <div className="mt-3">
                        <span className={`badge badge-lg ${
                          project.projectStatus === 'completed' ? 'badge-success' :
                          project.projectStatus === 'setup in progress' ? 'badge-warning' :
                          'badge-info'
                        } capitalize`}>
                          {project.projectStatus || 'assigned'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleUpdateStatus(project)}
                        className="btn btn-primary"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Projects Table */}
      <h2 className="text-2xl font-bold mb-4">All Projects</h2>
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Service</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Location</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
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
                <td>
                  <span className="truncate max-w-[150px] block">{project.location}</span>
                </td>
                <td className="font-bold">৳{project.totalCost?.toLocaleString() || 0}</td>
                <td>
                  <span className={`badge ${
                    project.projectStatus === 'completed' ? 'badge-success' :
                    project.projectStatus === 'setup in progress' ? 'badge-warning' :
                    'badge-info'
                  } capitalize`}>
                    {project.projectStatus || 'assigned'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleUpdateStatus(project)}
                    className="btn btn-sm btn-secondary"
                  >
                    <FaCheckCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-base-content/60">No projects assigned yet</p>
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {showStatusModal && selectedProject && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-4">Update Project Status</h3>

            <div className="mb-4 p-4 bg-base-200 rounded-lg">
              <p className="text-sm text-base-content/60 mb-1">Service</p>
              <p className="font-bold">{selectedProject.serviceName}</p>
              <p className="text-sm text-base-content/60 mt-2">Current Status</p>
              <span className="badge badge-info capitalize">
                {selectedProject.projectStatus || 'assigned'}
              </span>
            </div>

            <form onSubmit={handleStatusSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Select New Status*</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                >
                  {projectStatuses.map((status) => (
                    <option key={status} value={status} className="capitalize">
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedProject(null);
                    setNewStatus('');
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Updating...
                    </>
                  ) : (
                    'Update Status'
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

export default AssignedProjects;
