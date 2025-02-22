import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Spinner from "../../components/shared/Spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/signup.json";
import Lottie from "lottie-react";
import useAuth from "../../Hooks/useAuth";
const SignUp = () => {
  const { createUser, setUser, updateUserProfile, signinWithPop } = useAuth();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [eyeOpen, setEyeOpen] = useState(false);
  const navigate = useNavigate();
  const from = location.state || "/dashboard";
  const [passError, setPassError] = useState(true);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signinWithPop();
      const user = result.user;
      // console.log(user)
      if (user) {
        toast.success("User successfully signed in!");
        const redirectPath = from || "/dashboard/tasklist";
        navigate(redirectPath, { replace: true });
      }
      // console.log("Google signin")
    } catch (error) {
      // console.log("User unsuccesfull to signed in, please try again!")
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
    // console.log("Google signin comming soon")
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const userData = {
      name,
      email,
      password,
    };
    console.log("Comming soon email pass", userData);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return setPassError(
        "Password must be at least 6charecter longer, one uppercase and one lowercase"
      );
    } else {
      setPassError("");
    }

    try {
      setLoading(true);
      const result = await createUser(email, password);
      await updateUserProfile(name);

      console.log(result);
      setUser({ ...result.user, displayName: name });
      if (result.user.email) {
        toast.success("User created successfully!");
      } else {
        toast.error("User creating unsuccessfull!");
      }
      form
        ? navigate(from, { replace: true })
        : navigate("/dashboard/tasklist");
      // console.log("User created successfully!", result)
    } catch (error) {
      //   console.error('Error creating user:', error);
      toast.error("User creating unsuccessfull!" || error.message);
    } finally {
      setLoading(false);
    }
  };
  const showPass = () => {
    setEyeOpen(!eyeOpen);
  };
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-306px)] dark:text-dark-text bg-primary text-text dark:bg-dark-background">
      <div className="flex flex-col md:flex-row container mx-auto overflow-hidden rounded-lg shadow-lg ">
        <div className=" px-6 py-8 md:w-1/2">
          <p className="mt-3 text-xl text-center">Get Your Free Account Now.</p>

          {/* google sign in button */}
          <div
            onClick={handleGoogleSignIn}
            className="flex cursor-pointer items-center justify-center mt-4 transition-colors duration-300 transform border rounded-lg hover:text-white hover:bg-secondary"
          >
            <div className="px-4 py-2">
              <svg className="w-6 h-6" viewBox="0 0 40 40">
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#FFC107"
                />
                <path
                  d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                  fill="#FF3D00"
                />
                <path
                  d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                  fill="#4CAF50"
                />
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#1976D2"
                />
              </svg>
            </div>

            <span className="w-5/6 px-4 py-3 font-bold text-center">
              Sign in with Google
            </span>
          </div>

          {/* divider */}
          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b  lg:w-1/4"></span>

            <div className="text-xs text-center uppercase  hover:underline">
              or Registration with email
            </div>

            <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
          </div>

          {/* sign in with email and password form  */}
          <form onSubmit={handleSignUp}>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium " htmlFor="name">
                Username
              </label>
              <input
                id="name"
                autoComplete="name"
                name="name"
                className="block w-full px-4 py-2 border rounded-lg dark:border-dark-border dark:bg-dark-background dark:text-gray-900 focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                required
              />
            </div>
            {/* <div className='mt-4'>
                            <label
                                className='block mb-2 text-sm font-medium'
                                htmlFor='photo'
                            >
                                Photo URL
                            </label>
                            <input
                                id='photo'
                                autoComplete='photo'
                                name='photo'
                                className='block w-full px-4 py-2 border rounded-lg    focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300'
                                type='text'
                                required
                            />
                        </div> */}
            <div className="mt-4">
              <label
                className="block mb-2 text-sm font-medium"
                htmlFor="LoggingEmailAddress"
              >
                Email Address
              </label>
              <input
                id="LoggingEmailAddress"
                autoComplete="email"
                name="email"
                className="block w-full px-4 py-2 rounded-lg
                dark:border-dark-border dark:bg-dark-background dark:text-gray-900 focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300"
                type="email"
                required
              />
            </div>

            <div className="mt-4">
              <div className="relative">
                <div className="flex justify-between">
                  <label
                    className="block mb-2 text-sm font-medium"
                    htmlFor="loggingPassword"
                  >
                    Password
                  </label>
                </div>

                <input
                  id="loggingPassword"
                  autoComplete="current-password"
                  name="password"
                  className="block w-full px-4 py-2 border rounded-lg dark:border-dark-border dark:bg-dark-background dark:text-gray-900  focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300"
                  type={eyeOpen ? "text" : "password"}
                  required
                />
                <button
                  onClick={showPass}
                  type="button"
                  className="absolute right-5 top-10"
                  aria-label={eyeOpen ? "Hide password" : "Show password"}
                >
                  {eyeOpen ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            {passError && <p className="text-xs text-red-500">{passError}</p>}

            {/* sign up buttn */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-6 py-3 text-sm font-medium tracking-wide capitalize transition-colors duration-300 transform hover:text-teal-50 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
              >
                Sign Up
              </button>
            </div>
          </form>

          {/* sign in link */}
          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b  md:w-1/4"></span>

            <Link to="/" className="text-xs uppercase  hover:underline">
              or sign in
            </Link>

            <span className="w-1/5 border-b  md:w-1/4"></span>
          </div>
        </div>

        {/* lottie files */}
        <div className="flex justify-center mx-auto">
          <Lottie animationData={logo} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
