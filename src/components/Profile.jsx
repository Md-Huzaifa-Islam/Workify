const Profile = () => {
  // Static user details
  const user = {
    name: "John Doe",
    role: "Software Engineer",
    email: "john.doe@example.com",
    phone: "+123 456 7890",
    salary: "$75,000",
    department: "Development",
    joinDate: "2023-01-15",
    status: "Active",
    profileImage: "https://via.placeholder.com/150", // Replace with dynamic image URL
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg">
      {/* Profile Header */}
      <div className="flex items-center gap-6 border-b pb-6">
        <img
          src={user.profileImage}
          alt={`${user.name}'s profile`}
          className="h-32 w-32 rounded-full border-2 border-gray-300"
        />
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">{user.role}</p>
          <span
            className={`mt-2 inline-block rounded px-3 py-1 text-sm ${
              user.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      {/* Profile Details */}
      <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-4 text-gray-700 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Email</h3>
          <p>{user.email}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Phone</h3>
          <p>{user.phone}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Salary</h3>
          <p>{user.salary}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Department</h3>
          <p>{user.department}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Join Date</h3>
          <p>{user.joinDate}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
