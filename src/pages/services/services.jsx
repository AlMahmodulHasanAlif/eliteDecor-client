import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const Services = () => {
  const axiosSecure = useAxios();

  // Filter states
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Debounce searchInput → search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 500); // 500ms delay
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch services with React Query
  const {
    data: services = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["services", search, category, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (sortOrder) params.append("sort", sortOrder);

      const response = await axiosSecure.get(`/services?${params.toString()}`);
      return response.data;
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosSecure.get("/services");
      const allServices = response.data;
      const uniqueCategories = [
        ...new Set(allServices.map((s) => s.service_category)),
      ];
      return uniqueCategories;
    },
  });

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setCategory("");
    setSortOrder("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 py-20">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 bg-base-300 animate-pulse mx-auto rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="card bg-base-200 shadow-xl">
                <div className="h-64 bg-base-300 animate-pulse"></div>
                <div className="card-body">
                  <div className="h-6 bg-base-300 animate-pulse rounded mb-2"></div>
                  <div className="h-4 bg-base-300 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-base-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-error mb-4">
            Error Loading Services
          </h2>
          <p className="text-base-content/70">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 py-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            All <span className="text-primary">Decoration Services</span>
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Explore our complete range of professional decoration services
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-base-200 rounded-lg p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Search Services
                </span>
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                className="input input-bordered w-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Sort By</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(search || category || sortOrder) && (
            <div className="mt-4 text-center">
              <button onClick={clearFilters} className="btn btn-outline btn-sm">
                <FaTimes className="mr-2" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-lg text-base-content/70">
            Found{" "}
            <span className="font-bold text-primary">{services.length}</span>{" "}
            services
          </p>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <figure className="relative h-64">
                  <img
                    src={service.image}
                    alt={service.service_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="badge badge-primary badge-lg capitalize">
                      {service.service_category}
                    </span>
                  </div>
                </figure>

                <div className="card-body">
                  <h3 className="card-title text-xl">{service.service_name}</h3>
                  <p className="text-base-content/70 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="mt-4">
                    <p className="text-sm text-base-content/60">
                      Starting from
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ৳{service.cost.toLocaleString()}
                      <span className="text-sm font-normal text-base-content/60">
                        {" "}
                        /{service.unit}
                      </span>
                    </p>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/services/${service._id}`}
                      className="btn btn-primary btn-block"
                    >
                      View Details <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-4">No Services Found</h3>
            <p className="text-base-content/70 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
