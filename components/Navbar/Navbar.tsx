"use client";
import Link from "next/link";
import "./navbar.css";
import { useAuth } from "@/Context/Context";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 shadow-md navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Brand/Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/logo.png" alt="Skill Bridge Logo" className="logo" />
            <span className="text-xl font-bold text-black tracking-tight">
              <Link href="/">Skill Bridge</Link>
            </span>
          </div>

          {/* Buttons Section */}
          <div className="flex gap-4 items-center buttons">
            {user ? (
              pathname !== "/dashboard" && (
                <Link href="/dashboard">
                  <strong style={{ marginRight: "4px" }}>{user.name}</strong>
                  <button id="dashboard">Dashboard</button>
                </Link>
              )
            ) : (
              <>
                <Link href="/login">
                  <button id="login">Login</button>
                </Link>
                <Link href="/signup">
                  <button id="signup">Register</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
