import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const DynamicServices = () => {
  const axiosSecure = useAxios();

  const {
    data: services = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services", 6],
    queryFn: async () => {
      const res = await axiosSecure.get("/services?limit=6");
     
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 bg-base-100 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        Failed to load services
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-200">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-primary">Decoration Services</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Transform your space with our professional decoration services.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition"
            >
              <figure className="h-64">
                <img
                  src={service.image}
                  alt={service.service_name}
                  className="w-full h-full object-cover"
                />
              </figure>

              <div className="card-body">
                <h3 className="card-title">{service.service_name}</h3>
                <p className="text-base-content/70 line-clamp-2">
                  {service.description}
                </p>

                <p className="text-2xl font-bold text-primary mt-3">
                  ৳{Number(service.cost || 0).toLocaleString()}
                  <span className="text-sm text-base-content/60">
                    {" "}
                    /{service.unit}
                  </span>
                </p>

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

        {/* View all */}
        <div className="text-center mt-12">
          <Link to="/services" className="btn btn-outline btn-primary btn-lg">
            View All Services <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DynamicServices;
