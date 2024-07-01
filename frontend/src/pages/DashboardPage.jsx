import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState({});
  // fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/users/current-user`,
          {
            credentials: "include",
          }
        );

        const jsonData = await response.json();
        if (response.status !== 200) {
        } else {
          setUser(jsonData.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // logout logic
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/users/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.status === 200) {
        navigate("/login");
      } else {
        console.error("Logout failed:", response.statusText);
        // Handle logout failure
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle logout error
    }
  };

  return (
    <>
      {/* header */}
      <nav className="bg-[#36454F] flex justify-between items-center px-10 py-3">
        <h2 className="text-white font-bold text-xl">Welcome, {user.fullName}</h2>
        <div className="flex gap-2">
        <NavLink to="/profile">
        <button className="bg-blue-500 rounded px-3 py-2 text-white">Profile</button>
        </NavLink>
        <NavLink to="/login">
        <button onClick={handleLogout} className="bg-red-500 rounded px-3 py-2 text-white">Logout</button>
        </NavLink>
        </div>
      </nav>
    </>
  );
}

export default DashboardPage;
