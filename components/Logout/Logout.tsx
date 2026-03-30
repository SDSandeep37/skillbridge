import { use } from "react";
import "./logout.css";
import { FaSignOutAlt } from "react-icons/fa";

const Logout = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      <FaSignOutAlt size={18} />
    </button>
  );
};

export default Logout;
