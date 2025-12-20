import { useQuery } from "@tanstack/react-query";
import { FaStar, FaBriefcase, FaCheckCircle } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const TopDecorators = () => {
  const axiosSecure = useAxios();

  const { data: decorators = [], isLoading } = useQuery({
    queryKey: ["topDecorators"],
    queryFn: async () => {
      const response = await axiosSecure.get("/decorators/top?limit=6");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-base-300 animate-pulse mx-auto rounded mb-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="card bg-base-100 shadow-xl">
                <div className="h-48 bg-base-300 animate-pulse"></div>
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

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-primary">Top Decorators</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Meet our expert decoration professionals with proven track records
            and exceptional ratings
          </p>
        </div>

        {/* Decorators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {decorators.map((decorator) => (
            <div
              key={decorator._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Decorator Image */}
              <figure className="pt-8 px-8">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={decorator.image}
                      alt={decorator.name}
                      className="object-cover"
                    />
                  </div>
                </div>
              </figure>

              {/* Card Body */}
              <div className="card-body items-center text-center">
                <h3 className="card-title text-2xl">{decorator.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-warning">
                    <FaStar />
                    <span className="font-bold text-lg">
                      {decorator.decoratorInfo?.rating || 0}
                    </span>
                  </div>
                  <span className="text-base-content/60">
                    ({decorator.decoratorInfo?.completedProjects || 0} projects)
                  </span>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-2 text-base-content/70 mb-2">
                  <FaBriefcase />
                  <span>
                    {decorator.decoratorInfo?.experience || "N/A"} experience
                  </span>
                </div>

                {/* Specialties */}
                <div className="w-full">
                  <p className="text-sm font-semibold mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {decorator.decoratorInfo?.specialties?.map(
                      (specialty, index) => (
                        <span
                          key={index}
                          className="badge badge-primary badge-sm"
                        >
                          {specialty}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Bio */}
                {decorator.decoratorInfo?.bio && (
                  <p className="text-sm text-base-content/70 mt-3 line-clamp-2">
                    {decorator.decoratorInfo.bio}
                  </p>
                )}

                {/* Status Badge */}
                {decorator.decoratorInfo?.status === "active" && (
                  <div className="badge badge-success gap-2 mt-2">
                    <FaCheckCircle />
                    Available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        {decorators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-base-content/70">
              No decorators available at the moment
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopDecorators;
