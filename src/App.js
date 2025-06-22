import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import "./assets/css/tailwind.css";
import Login from "./pages/pages/auth/login";
import Signup from "./pages/pages/auth/signup";
import ForgotPassword from "./pages/pages/auth/forgot-password";
import ResetPassword from "./pages/pages/auth/reset-password";
import EmailConfirmation from "./pages/pages/email-template/email-confirmation";
import EmailCart from "./pages/pages/email-template/email-cart";
import EmailOffers from "./pages/pages/email-template/email-offers";
import EmailOrderSuccess from "./pages/pages/email-template/email-order-success";
import EmailResetPassword from "./pages/pages/email-template/email-reset-password";
import Blogs from "./pages/pages/blog/blogs";
import BlogDetail from "./pages/pages/blog/blog-detail";
import Helpcenter from "./pages/pages/helpcenter/helpcenter";
import HelpcenterGuides from "./pages/pages/helpcenter/helpcenter-guides";
import HelpcenterSupport from "./pages/pages/helpcenter/helpcenter-support";
import HelpcenterFaqs from "./pages/pages/helpcenter/helpcenter-faqs";
import Comingsoon from "./pages/pages/special/comingsoon";
import Maintenance from "./pages/pages/special/maintenance";
import Error from "./pages/pages/special/error";
import Terms from "./pages/pages/utility/terms";
import Privacy from "./pages/pages/utility/privacy";
import AboutUS from './pages/pages/aboutus';
import Contact from './pages/contact';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      <Route path="/reset-password" element={<ResetPassword />}></Route>
      <Route path="/email-confirmation" element={<EmailConfirmation />}></Route>
      <Route path="/email-cart" element={<EmailCart />}></Route>
      <Route path="/email-offers" element={<EmailOffers />}></Route>
      <Route
        path="/email-order-success"
        element={<EmailOrderSuccess />}
      ></Route>
      <Route
        path="/email-reset-password"
        element={<EmailResetPassword />}
      ></Route>
      <Route path="/blogs" element={<Blogs />}></Route>
      <Route path="/blog-detail" element={<BlogDetail />}></Route>
      <Route path="/blog-detail/:id" element={<BlogDetail />}></Route>
      <Route path="/helpcenter" element={<Helpcenter />}></Route>
      <Route path="/helpcenter-guides" element={<HelpcenterGuides />}></Route>
      <Route path="/helpcenter-support" element={<HelpcenterSupport />}></Route>
      <Route path="/helpcenter-faqs" element={<HelpcenterFaqs />}></Route>
      <Route path="/comingsoon" element={<Comingsoon />}></Route>
      <Route path="/maintenance" element={<Maintenance />}></Route>
      <Route path="/error" element={<Error />}></Route>
      <Route path="/terms" element={<Terms />}></Route>
      <Route path="/privacy" element={<Privacy />}></Route>
      <Route path="/aboutus" element={<AboutUS/>}></Route>
      <Route path="/contact" element={<Contact/>}></Route>


    </Routes>
  );
}

export default App;
