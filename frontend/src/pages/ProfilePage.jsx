import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaPoll } from "react-icons/fa";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isEditable, setEditable] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  // Fetch current user
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
        if (response.status === 200) {
          setUser(jsonData.user);
          setEditedName(jsonData.user.fullName);
        } else {
          console.error("Failed to fetch user:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Logout logic
  const handleLogout = async () => {
    if (editedEmail === "") {
      setEditedEmail(user.email);
    }
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
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/users/update-profile/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ fullName: editedName}),
        }
      );

      if (response.status === 200) {
        const jsonData = await response.json();
        setUser(jsonData.updatedUser);
        setEditable(false);
      } else {
        console.error("Update failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      {/* Header */}
      <nav className="bg-[#36454F] flex justify-between items-center px-10 py-3">
        <NavLink to="/dashboard">
          <h1 className="text-white text-2xl">
            <FaPoll />
          </h1>
        </NavLink>

        <NavLink to="/login">
          <button
            onClick={handleLogout}
            className="bg-red-500 rounded px-3 py-2 text-white"
          >
            Logout
          </button>
        </NavLink>
      </nav>

      <section className="min-h-screen flex justify-center bg-[#000814]">
        <div className="min-w-[700px] rounded-md p-2">
          <h2 className="text-xl font-bold text-white mt-5">My Profile</h2>

          <div className="rounded bg-[#161D29] flex items-center justify-between p-2 mt-5">
            <div className="flex flex-col gap-2">
              <p className="text-xl text-white">Name</p>
              {isEditable ? (
                <input
                  className="bg-[#161D29] outline-none text-white text-2xl font-bold"
                  placeholder={user.fullName}
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              ) : (
                <h2 className="text-2xl font-bold text-white">
                  {user.fullName}
                </h2>
              )}
            </div>
            {isEditable ? (
              <div className="flex gap-2">
                <button
                  className="bg-gray-400 text-black px-5 py-2 rounded"
                  onClick={() => setEditable(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-yellow-400 text-black px-5 py-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                className="bg-yellow-400 text-black px-5 py-2 rounded"
                onClick={() => setEditable(true)}
              >
                Edit
              </button>
            )}
          </div>

          <p className="text-white mt-5">Personal Details</p>

          <div className="rounded bg-[#161D29] flex items-center justify-between p-2 mt-5">
            <div className="flex flex-col">
              <p className="text-white">
                Email :{" "}
                <span className="text-white font-semibold">{user.email}</span>
              </p>
              <p className="text-white">
                MOB :{" "}
                <span className="text-white font-semibold">
                  {user.phoneNumber}
                </span>
              </p>
              <p className="text-white text-xl mt-5">
                Account Type :{" "}
                <span className="text-white font-semibold">{user.role}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default DashboardPage;
