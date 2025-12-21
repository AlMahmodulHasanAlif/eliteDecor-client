import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUserTie, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useAxios from '../../hooks/useAxios';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const [roleFilter, setRoleFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers', roleFilter, searchText],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (searchText) params.append('searchText', searchText);
      
      const response = await axiosSecure.get(`/admin/users?${params.toString()}`);
      return response.data;
    }
  });

  // Make decorator mutation
  const makeDecoratorMutation = useMutation({
    mutationFn: async (email) => {
      return await axiosSecure.patch(`/admin/users/${email}/make-decorator`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success('User promoted to decorator successfully');
    },
    onError: () => {
      toast.error('Failed to promote user');
    }
  });

  // Toggle decorator status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ email, status }) => {
      return await axiosSecure.patch(`/admin/users/${email}/demote-decorator`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success('Decorator status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  const handleMakeDecorator = (email) => {
    if (window.confirm('Are you sure you want to make this user a decorator?')) {
      makeDecoratorMutation.mutate(email);
    }
  };

  const handleToggleStatus = (email, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'enable' : 'disable';
    
    if (window.confirm(`Are you sure you want to ${action} this decorator?`)) {
      toggleStatusMutation.mutate({ email, status: newStatus });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchText(searchInput);
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
        <h1 className="text-3xl md:text-4xl font-bold">Manage Users</h1>
        <p className="text-base-content/60 mt-2">
          View users and promote them to decorators
        </p>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-xl mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Search Users</span>
            </label>
            <div className="join w-full">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input input-bordered join-item w-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary join-item">
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Role Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Filter by Role</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">Users Only</option>
              <option value="decorator">Decorators Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{users.length}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        <img
                            src={user?.image || user.photoURL || 'https://via.placeholder.com/150?text=No+Image'}
                            alt={user?.name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="text-sm">{user.email}</td>
                <td>
                  <span
                    className={`badge ${
                      user.role === 'admin'
                        ? 'badge-error'
                        : user.role === 'decorator'
                        ? 'badge-secondary'
                        : 'badge-primary'
                    } capitalize`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.role === 'decorator' && user.decoratorInfo?.status && (
                    <span
                      className={`badge ${
                        user.decoratorInfo.status === 'active'
                          ? 'badge-success'
                          : 'badge-error'
                      } capitalize`}
                    >
                      {user.decoratorInfo.status}
                    </span>
                  )}
                </td>
                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>
                  <div className="flex gap-2">
                    {user.role === 'user' && (
                      <button
                        onClick={() => handleMakeDecorator(user.email)}
                        className="btn btn-sm btn-secondary"
                        disabled={makeDecoratorMutation.isPending}
                      >
                        <FaUserTie />
                      </button>
                    )}
                    
                    {user.role === 'decorator' && (
                      <button
                        onClick={() => handleToggleStatus(user.email, user.decoratorInfo?.status)}
                        className={`btn btn-sm ${
                          user.decoratorInfo?.status === 'active'
                            ? 'btn-warning'
                            : 'btn-success'
                        }`}
                        disabled={toggleStatusMutation.isPending}
                      >
                        {user.decoratorInfo?.status === 'active' ? (
                          <FaTimesCircle />
                        ) : (
                          <FaCheckCircle />
                        )}
                      </button>
                      
                    )}
                  </div>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-base-content/60">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;