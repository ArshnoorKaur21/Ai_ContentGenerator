import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../Alert/StatusMessage";
import { useMutation } from "@tanstack/react-query";
import { loginAPI } from "../APIS/usersAPI/users";
import { useAuth } from "../../AuthContext/AuthContext";

const Login = () => {
  const { isAuthenticated, login, logout } = useAuth();
  // console.log("Login is",login);
  // console.log("IS auth",isAuthenticated);
  useEffect(()=>{
    if(isAuthenticated){
      navigate("/dashboard");
    }
  },[isAuthenticated]);
  const navigate=useNavigate();
  const userMutation=useMutation({
    mutationKey:["user-login"],
    mutationFn:loginAPI,
  });
  const formik=useFormik({
    initialValues:{
      email:"",
      password:"",
    },
    validationSchema:Yup.object({
      email:Yup.string().email("Enter correct email").required("Enter your email"),
      password:Yup.string().required("Enter your password"),
    }),
    onSubmit:(values)=>{
      userMutation.mutateAsync(values).then(()=>{
        setTimeout(()=>{
          navigate("/dashboard")
        },5000)
        
      }).catch((err)=>{
        console.log(err);
      })
    }
  }

);
useEffect(()=>{
  if(userMutation.isSuccess){
    login();
  }
},[userMutation.isSuccess]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 m-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Login to Your Account
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Your Email
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
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Your Password
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

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Don't have an account? Register
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
