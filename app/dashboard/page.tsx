"use client";
// user dashboard page

import AuthDashboard from "@/components/AuthDashboard/AuthDashboard";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import { useAuth } from "@/Context/Context";

const page = () => {
  const { user, loading } = useAuth();

  return (
    <AuthDashboard>
      <div style={{ padding: "10px 0px" }}>
        <h1 className="text-shadow-white font-semibold text-[32px] text-center">
          Dashboard
        </h1>
      </div>
      {user?.role && user.role === "mentor" && (
        <div
          style={{ marginBottom: "24px" }}
          className="cards flex gap-6 items-center justify-center w-full flex-wrap"
        >
          <DashboardCard
            title="Students"
            description="To view all student details"
            path="/dashboard/students"
            buttonText="Click Here"
          />
          <DashboardCard
            title="Sessions"
            description="To view all sessions details"
            path="/dashboard/sessions"
            buttonText="Click Here"
          />
        </div>
      )}
      {user?.role && user.role === "student" && (
        <div
          style={{ marginBottom: "24px" }}
          className="cards flex gap-6 items-center justify-center w-full flex-wrap"
        >
          <DashboardCard
            title="Sessions"
            description="To view all sessions details"
            path="/dashboard/sessions"
            buttonText="Click Here"
          />
        </div>
      )}
    </AuthDashboard>
  );
};

export default page;
