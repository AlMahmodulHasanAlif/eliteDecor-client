import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const ManageServices = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    service_name: '',
    cost: '',
    unit: '',
    service_category: '',
    description: '',
    image: '',
    features: '',
  });

  // Fetch all services
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['adminServices'],
    queryFn: async () => {
      const response = await axiosSecure.get('/services');
      return response.data;
    }
  });


  const createMutation = useMutation({
    mutationFn: async (newService) => {
      return await axiosSecure.post('/services', newService);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminServices']);
      toast.success('Service created successfully');
      setShowModal(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to create service');
    }
  });

  // Update service mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await axiosSecure.put(`/services/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminServices']);
      toast.success('Service updated successfully');
      setShowModal(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update service');
    }
  });

  // Delete service mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminServices']);
      toast.success('Service deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete service');
    }
  });

  const resetForm = () => {
    setFormData({
      service_name: '',
      cost: '',
      unit: '',
      service_category: '',
      description: '',
      image: '',
      features: '',
    });
    setEditingService(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceData = {
      ...formData,
      cost: parseFloat(formData.cost),
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
      createdByEmail: user?.email
    };

    if (editingService) {
      updateMutation.mutate({ id: editingService._id, data: serviceData });
    } else {
      createMutation.mutate(serviceData);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      service_name: service.service_name,
      cost: service.cost,
      unit: service.unit,
      service_category: service.service_category,
      description: service.description,
      image: service.image || '',
      features: service.features?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteMutation.mutate(id);
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Manage Services</h1>
          <p className="text-base-content/60 mt-2">
            Add, edit, or remove decoration services
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <FaPlus className="mr-2" />
          Add Service
        </button>
      </div>

      {/* Stats */}
      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Total Services</div>
          <div className="stat-value text-primary">{services.length}</div>
        </div>
      </div>

      {/* Services Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Image</th>
              <th>Service Name</th>
              <th>Category</th>
              <th>Cost</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>
                  <div className="avatar">
                    <div className="w-16 h-16 rounded">
                      <img src={service.image} alt={service.service_name} />
                    </div>
                  </div>
                </td>
                <td className="font-semibold">{service.service_name}</td>
                <td>
                  <span className="badge badge-primary capitalize">
                    {service.service_category}
                  </span>
                </td>
                <td className="font-bold">৳{service.cost.toLocaleString()}</td>
                <td>{service.unit}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="btn btn-sm btn-warning"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="btn btn-sm btn-error"
                      disabled={deleteMutation.isPending}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-base-content/60">No services found</p>
            <button 
              onClick={() => setShowModal(true)}
              className="btn btn-primary mt-4"
            >
              Add Your First Service
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-2xl mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Service Name*</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.service_name}
                    onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                    required
                  />
                </div>

                {/* Cost */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Cost (BDT)*</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    required
                  />
                </div>

                {/* Unit */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Unit*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="per event, per room, etc."
                    className="input input-bordered"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  />
                </div>

                {/* Category */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Category*</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.service_category}
                    onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="wedding">Wedding</option>
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="seminar">Seminar</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text font-semibold">Image URL*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text font-semibold">Description*</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>

              {/* Features */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text font-semibold">Features (comma-separated)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="LED Lighting, Stage Setup, Photo Booth"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                ></textarea>
                <label className="label">
                  <span className="label-text-alt">Separate features with commas</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : editingService ? (
                    'Update Service'
                  ) : (
                    'Create Service'
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

export default ManageServices;