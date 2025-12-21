import { FaEnvelope, FaUser, FaCalendar } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const MyProfile = () => {
  const { user } = useAuth();
  

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
        <p className="text-base-content/60 mt-2">
          View your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="card bg-base-100 shadow-xl max-w-2xl">
        <div className="card-body">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div className="avatar">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user?.photoURL} alt={user?.displayName} />
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
              <FaUser className="text-primary text-2xl" />
              <div>
                <p className="text-sm text-base-content/60">Full Name</p>
                <p className="font-semibold text-lg">
                  {user?.displayName || "N/A"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
              <FaEnvelope className="text-primary text-2xl" />
              <div>
                <p className="text-sm text-base-content/60">Email Address</p>
                <p className="font-semibold text-lg">{user?.email || "N/A"}</p>
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
              <FaCalendar className="text-primary text-2xl" />
              <div>
                <p className="text-sm text-base-content/60">Member Since</p>
                <p className="font-semibold text-lg">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
