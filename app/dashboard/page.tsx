"use client";
import { useAuth } from "@/Context/Context";

// user dashboard page

const page = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <p>Please wait while loading your profile</p>
      </div>
    );
  }
  return <div>Dashboard</div>;
};

export default page;
