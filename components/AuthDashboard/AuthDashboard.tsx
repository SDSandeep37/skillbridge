"use client";

import { useAuth } from "@/Context/Context";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const AuthDashboard = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const timer = setTimeout(() => {
        router.replace("/");
      }, 1000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-3">
        <p>Please wait while loading your profile</p>
      </div>
    );
  }
  if (!user || user === null) {
    return (
      <div className="flex items-center justify-center mt-3">
        <p className="text-red-400">
          Session Expired/Unautherised access! Please Login Again
        </p>
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthDashboard;
