import React from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import navImg from "../../assets/navandfoot.webp";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
    const links = (
      <>
        <li>
          <NavLink className={({isActive})=>`${isActive? "bg-sky-400 btn-outline": "bg-sky-300 btn-outline"} mr-2`} to={"/dashboard"}>Home</NavLink>
        </li>
        <li>
          <NavLink className={({isActive})=>`${isActive? "bg-sky-400 btn-outline": "bg-sky-300 btn-outline"} mr-2`} to={"/"}>Home</NavLink>
        </li>
        <li>
          <NavLink className={({isActive})=>`${isActive? "bg-sky-400 btn-outline": "bg-sky-300 btn-outline"} mr-2`} to={"/"}>Home</NavLink>
        </li>
      </>
    );

//   const links = (
//     <div role="tablist" className="tabs tabs-lifted">
//       <NavLink
//         to="/"
//         className={({ isActive }) =>
//           `tab ${isActive ? "tab-active bg-sky-400 " : ""}`
//         }
//       >
//         Home
//       </NavLink>

//       <NavLink
//         to="/about"
//         className={({ isActive }) =>
//           `tab ${isActive ? "tab-active bg-sky-400" : ""}`
//         }
//       >
//         About
//       </NavLink>

//       <NavLink
//         to="/contact"
//         className={({ isActive }) =>
//           `tab ${isActive ? "tab-active bg-sky-400" : ""}`
//         }
//       >
//         Contact
//       </NavLink>
//     </div>
//   );
  return (
    <div className="navbar fixed top-0 left-0 md:z-40 bg-sky-300 md:px-6 ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <Link
          to={"/"}
          className="hover:cursor-pointer hover:text-blue-600 hover:underline text-xl"
        >
          <img className="w-full h-10 object-cover rounded-lg" src={navImg} />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end">
        {!user ? (
          <NavLink
            to={"/joinus"}
            className={
              "hover:cursor-pointer hover:text-blue-600 hover:underline"
            }
          >
            Join Us
          </NavLink>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User"
                  src={
                    user?.photoURL ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li onClick={signOutUser}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
