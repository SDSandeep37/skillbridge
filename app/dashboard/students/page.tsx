"use client";
import DetailsTable from "@/components/DetailsTable/DetailsTable";
import { useEffect, useState } from "react";
import AuthDashboard from "@/components/AuthDashboard/AuthDashboard";
const StudentsPage = () => {
  const [studentsDetails, setStudentsDetails] = useState([]);
  useEffect(() => {
    async function getStudentsDetail() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/students`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (response.ok) {
          const students = await response.json();
          setStudentsDetails(students.students);
        }
      } catch (error) {}
    }
    getStudentsDetail();
  }, []);
  return (
    <AuthDashboard>
      <div style={{ margin: "20px 0px", padding: "20px" }}>
        <h1
          className="text-2xl font-medium text-amber-100 text-center"
          style={{ padding: "20px" }}
        >
          All students details
        </h1>
        <DetailsTable data={studentsDetails} tableFor="studentsDetails" />
      </div>
    </AuthDashboard>
  );
};

export default StudentsPage;
