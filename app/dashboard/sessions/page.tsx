"use client";
import DetailsTable from "@/components/DetailsTable/DetailsTable";
import { useEffect, useState } from "react";
import AuthDashboard from "@/components/AuthDashboard/AuthDashboard";
import { useAuth } from "@/Context/Context";
const SessionsPage = () => {
  const { user, loading } = useAuth();
  const [sessionsDetails, setSessionsDetails] = useState([]);
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "mentor") {
        getSessionsForMentor();
      }
      if (user.role === "student") {
        getSessionsForStudent();
      }
    }
  }, [user]);
  async function getSessionsForMentor() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/mentor`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const sessions = await response.json();
        console.log(sessions.sessionDetails);
        setSessionsDetails(sessions.sessionDetails);
        console.log(sessionsDetails);
      }
    } catch (error) {
      console.log("Error fetching mentor session", error);
    }
  }

  //getting sessions for student
  async function getSessionsForStudent() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/student`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const sessions = await response.json();
        setSessionsDetails(sessions.sessionDetails);
      }
    } catch (error) {
      console.log("Error fetching student session", error);
    }
  }
  return (
    <AuthDashboard>
      <div style={{ margin: "20px 0px", padding: "20px" }}>
        <h1
          className="text-2xl font-medium text-amber-100 text-center"
          style={{ padding: "20px" }}
        >
          All session details
        </h1>
        {sessionsDetails.length > 0 && (
          <DetailsTable
            data={sessionsDetails}
            tableFor={
              user?.role === "mentor"
                ? "sessionDetailsMentor"
                : "sessionDeatilsStudent"
            }
          />
        )}
      </div>
    </AuthDashboard>
  );
};

export default SessionsPage;
