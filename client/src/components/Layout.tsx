import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/dragon.svg";
import drop from "../images/dropdown.svg";

const Layout = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");
  const [pictureUrl, setPictureUrl] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/auth");
  };

  useEffect(() => {
    const fetchPicture = async () => {
      const endpoint = `${import.meta.env.VITE_SERVER}/client/picture`;

      try {
        const response = await axios.post(endpoint, {
          username,
        });

        setPictureUrl(response.data.picture_url);
        console.log(response.data.picture_url);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error response data:", error.response?.data);
          console.error("Axios error response status:", error.response?.status);
          console.error("Axios error message:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    if (username) {
      fetchPicture();
    }
  }, [username]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-black p-4 flex justify-between items-center">
        <div className="flex flex-row items-center">
          <img src={logo} alt="Website Logo" className="h-12 w-12 mr-2" />
          <div
            className="text-white text-2xl font-bold cursor-pointer"
            onClick={() => navigate(`/`)}
          >
            TitanMart
          </div>
        </div>
        <ul className="flex space-x-2 items-center">
          {token ? (
            <>
              <span className="text-white">Hello, </span>
              <div className="relative">
                <li
                  className="text-white cursor-pointer hover:underline font-bold"
                  onClick={() => navigate(`/profile/${username}`)}
                >
                  {username}
                </li>
              </div>
              <div className="relative">
                <img
                  src={drop}
                  alt="Menu"
                  className="h-2 mt-1 mr-4"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <ul
                    className="absolute right-0 mt-2 bg-white border"
                    style={{ width: "96px" }}
                  >
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Log Out
                    </li>
                  </ul>
                )}
              </div>
              {pictureUrl && (
                <img
                  src={pictureUrl}
                  alt="Profile Picture"
                  className="h-8 w-8"
                />
              )}
            </>
          ) : (
            <>
              <li
                className="text-white cursor-pointer hover:underline"
                onClick={() => navigate("/auth")}
              >
                Log In
              </li>
              <li
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                onClick={() => navigate("/auth")}
              >
                Sign Up
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
