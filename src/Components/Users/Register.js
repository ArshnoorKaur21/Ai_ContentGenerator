import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../Alert/StatusMessage";
import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../APIS/usersAPI/users";
import { useAuth } from "../../AuthContext/AuthContext";
const Registration = () => {
  const { isAuthenticated } = useAuth();
 const navigate=useNavigate();
 useEffect(()=>{
  if(isAuthenticated){
    navigate("/dashboard");
  }
},[isAuthenticated])
 const userMutation=useMutation({
  mutationKey:['user-registration'],
  mutationFn:registerAPI,
 });

 const formik=useFormik({
  initialValues:{
    name:"",
    email:"",
    password:"",
  },
  validationSchema:Yup.object({
    name:Yup.string().required("User name is required"),
    email:Yup.string().email("Enter valid Email").required("Email is required")
 ,password:Yup.string().required("Password is required"),
 }),
 onSubmit: (values) => {
  console.log(values);
  userMutation
    .mutateAsync(values)
    .then(() => {
      // redirect
      navigate("/login");
    })
    .catch((err) => console.log(err));
},
 });
 console.log(userMutation);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 m-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Create an account to get free access for 3 days. No credit card
          required.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
  
          <div>
          {userMutation.isPending && (
              <StatusMessage type="loading" message="Loading please wait..." />
            )}
            {userMutation.isSuccess && (
              <StatusMessage type="success" message="Registration success" />
            )}
            {userMutation.isError && (
              <StatusMessage
                type="error"
                message={userMutation.error.response.data.message}
              />
            )}
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              {...formik.getFieldProps("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              placeholder="John Doe"
            />
            {formik.touched.username && formik.errors.name && (
              <div className="text-red-500 mt-1">{formik.errors.name}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 mt-1">{formik.errors.email}</div>
            )}
          </div>

  
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 mt-1">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </form>
        <div className="text-sm mt-2">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
