import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/index';
import './assets/css/tailwind.css';

import Products from './pages/shop/shop-grid/products';
import ShopList from './pages/shop/shop-list/shop-list';
import ShopListLeftSidebar from './pages/shop/shop-list/shop-list-left-sidebar';
import ShopListRightSidebar from './pages/shop/shop-list/shop-list-right-sidebar';
import Shopcart from './pages/shop/shop-cart';
import ShopCheckOut from './pages/shop/shop-checkout';
import OurStore from './pages/shop/our-store';
import Brands from './pages/shop/brands';
import CompareProduct from './pages/shop/compare-product';
import RecentlyViewed from './pages/shop/recently-viewed-product';
import AboutUS from './pages/pages/aboutus';
import UserAccount from './pages/pages/my-account/user-account';
import UserBilling from './pages/pages/my-account/user-billing';
import UserPayment from './pages/pages/my-account/user-payment';
import Invoice from './pages/pages/my-account/user-invoice';
import UserSocial from './pages/pages/my-account/user-social';
import Notification from './pages/pages/my-account/user-notification';
import UserSetting from './pages/pages/my-account/user-setting';
import EmailCart from './pages/pages/email-template/email-cart';
import EmailConfirmation from './pages/pages/email-template/email-confirmation';
import EmailOffers from './pages/pages/email-template/email-offers';
import EmailOrderSuccess from './pages/pages/email-template/email-order-success';
import EmailGiftVoucher from './pages/pages/email-template/email-gift-voucher';
import EmailResetPassword from './pages/pages/email-template/email-reset-password';
import EmailItemReviw from './pages/pages/email-template/email-item-review';
import Blogs from './pages/pages/blog/blogs';
import BlogDetail from './pages/pages/blog/blog-detail';
import Career from './pages/pages/career';
import Helpcenter from './pages/pages/helpcenter/helpcenter';
import HelpcenterGuides from './pages/pages/helpcenter/helpcenter-guides';
import HelpcenterSupport from './pages/pages/helpcenter/helpcenter-support';
import HelpcenterFaqs from './pages/pages/helpcenter/helpcenter-faqs';
import Terms from './pages/pages/utility/terms';
import Privacy from './pages/pages/utility/privacy';
import Login from './pages/pages/auth/login';
import Signup from './pages/pages/auth/signup';
import ForgotPassword from './pages/pages/auth/forgot-password';
import LockScreen from './pages/pages/auth/lock-screen';
import Comingsoon from './pages/pages/special/comingsoon';
import Maintenance from './pages/pages/special/maintenance';
import Error from './pages/pages/special/error';
import Sale from './pages/sale';
import Contact from './pages/contact';
import ProductDetailOne from './pages/shop/shop-detail/product-detail-one';
import SignSuccess from './pages/pages/auth/signup-success';
import ResetPassword from './pages/pages/auth/reset-password';
import { CartProvider } from "./contexts/CartContext";


function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Index />}></Route>

        <Route path="/products" element={<Products />}></Route>

        <Route path="/shop-list" element={<ShopList />}></Route>
        <Route path="/shop-list-left-sidebar" element={<ShopListLeftSidebar />}></Route>
        <Route path="/shop-list-right-sidebar" element={<ShopListRightSidebar />}></Route>
        <Route path="/shop-cart" element={<Shopcart />}></Route>
        <Route path="/shop-checkout" element={<ShopCheckOut />}></Route>
        <Route path="/our-store" element={<OurStore />}></Route>
        <Route path="/brands" element={<Brands />}></Route>
        <Route path="/compare-product" element={<CompareProduct />}></Route>
        <Route path="/recently-viewed-product" element={<RecentlyViewed />}></Route>
        <Route path="/aboutus" element={<AboutUS />}></Route>
        <Route path="/user-account" element={<UserAccount />}></Route>
        <Route path="/user-billing" element={<UserBilling />}></Route>
        <Route path="/user-payment" element={<UserPayment />}></Route>
        <Route path="/user-invoice" element={<Invoice />}></Route>
        <Route path="/user-social" element={<UserSocial />}></Route>
        <Route path="/user-notification" element={<Notification />}></Route>
        <Route path="/user-setting" element={<UserSetting />}></Route>
        <Route path="/email-cart" element={<EmailCart />}></Route>
        <Route path="/email-confirmation" element={<EmailConfirmation/>}></Route>

        <Route path="/email-offers" element={<EmailOffers />}></Route>
        <Route path="/email-order-success" element={<EmailOrderSuccess />}></Route>
        <Route path="/email-gift-voucher" element={<EmailGiftVoucher />}></Route>
        <Route path="/email-reset-password" element={<EmailResetPassword />}></Route>
        <Route path="/email-item-review" element={<EmailItemReviw />}></Route>
        <Route path="/blogs" element={<Blogs />}></Route>
        <Route path="/blog-detail" element={<BlogDetail />}></Route>
        <Route path="/blog-detail/:id" element={<BlogDetail />}></Route>
        <Route path="/career" element={<Career />}></Route>
        <Route path="/helpcenter" element={<Helpcenter />}></Route>
        <Route path="/helpcenter-guides" element={<HelpcenterGuides />}></Route>
        <Route path="/helpcenter-support" element={<HelpcenterSupport />}></Route>
        <Route path="/helpcenter-faqs" element={<HelpcenterFaqs />}></Route>
        <Route path="/terms" element={<Terms />}></Route>
        <Route path="/privacy" element={<Privacy />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/lock-screen" element={<LockScreen />}></Route>
        <Route path="/comingsoon" element={<Comingsoon />}></Route>
        <Route path="/maintenance" element={<Maintenance />}></Route>
        <Route path="/error" element={<Error />}></Route>
        <Route path="/sale" element={<Sale />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/product-detail-one" element={<ProductDetailOne />}></Route>
        <Route path="/product-detail-one/:id" element={<ProductDetailOne />}></Route>
        <Route path='/signup-success' element={<SignSuccess />}></Route>
        <Route path='/reset-password/:token' element={<ResetPassword />}></Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
