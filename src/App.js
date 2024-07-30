import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./Components/Users/Register";
import Login from "./Components/Users/Login";
import Dashboard from "./Components/Users/UserDashboard";
import PublicNavbar from "./Components/Navbar/PublicNavbar";
import PrivateNavbar from "./Components/Navbar/PrivateNavbar";
import Home from "./Components/Home/Home";
import { useAuth } from "./AuthContext/AuthContext";
import AuthRoute from "./Components/AuthRoute/AuthRoute";
import GenerateContent from "./Components/ContentGeneration/GenerateContent";
import ContentGenerationHistory from "./Components/Users/ContentGeneration/ContentGenerationHistory";
import HomeFeatures from "./Components/Home/HomeFeatures";
import AboutUs from "./Components/About/AboutUs";
import Plans from "./Components/Plans/Plan";
import FreePlanSignup from "./Components/StripePayment/FreePlanSignup";
import CheckoutForm from "./Components/StripePayment/CheckoutForm";
import PaymentSuccess from "./Components/StripePayment/PaymentSuccess";
const App = () => {
const {isAuthenticated}=useAuth();
  return (
    <>
      <BrowserRouter>
      {isAuthenticated? <PrivateNavbar/>:<PublicNavbar/>}
     
        <Routes>
<Route path="/checkout/:plan" element={<CheckoutForm/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/success" element={<PaymentSuccess/>}/>
          <Route path="/features" element={<HomeFeatures/>}/>
          <Route path="/plans" element={<Plans/>}/>
          <Route path="/about" element={<AboutUs/>}/>
          <Route path="/free-plan" element={<FreePlanSignup/>}/>
         <Route path="/register" element={<Registration/>}/>
         <Route path="/login" element={<Login/>}/>
         <Route path="/generate-content" element={<AuthRoute>
          <GenerateContent/>
          </AuthRoute>} />
          <Route path="/history" element={<AuthRoute>
            <ContentGenerationHistory/>
          </AuthRoute>} />
          {/* <Route path="/history" element=
          {<ContentGenerationHistory/>

          }/>
     */}
         <Route path="/dashboard" element={<AuthRoute>
          <Dashboard/>
          </AuthRoute>} />
     
          

        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
