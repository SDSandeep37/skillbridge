"use client";
import Banner from "@/components/Banner/Banner";
import Login from "@/components/Login/Login";
import SignUp from "@/components/SignUp/SignUp";
import { useAuth } from "@/Context/Context";
const App = () => {
  const { user, loading } = useAuth();

  return (
    <div>
      <Banner />
      {!loading && !user && (
        <>
          <SignUp />
          <Login />
        </>
      )}
    </div>
  );
};

export default App;
