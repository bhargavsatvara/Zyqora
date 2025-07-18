import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Breadcrumb from './components/layout/Breadcrumb';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import AddCategory from './pages/AddCategory';
import EditCategory from './pages/EditCategory';
import Brands from './pages/Brands';
import Inventory from './pages/Inventory';
import Coupons from './pages/Coupons';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import AddBrand from './pages/AddBrand';
import Departments from './pages/Departments';
import AddDepartment from './pages/AddDepartment';
import EditDepartment from './pages/EditDepartment';
import EditBrand from './pages/EditBrand.jsx';
import AddUser from './pages/AddUser.jsx';
import Countries from './pages/Countries.jsx';
import AddCountry from './pages/AddCountry.jsx';
import EditCountry from './pages/EditCountry.jsx';
import States from './pages/States.jsx';
import Cities from './pages/Cities.jsx';
import AddState from './pages/AddState.jsx';
import EditState from './pages/EditState.jsx';
import AddCity from './pages/AddCity.jsx';
import EditCity from './pages/EditCity.jsx';
import Colors from './pages/Colors.jsx';
import AddColor from './pages/AddColor.jsx';
import EditColor from './pages/EditColor.jsx';
import Sizes from './pages/Sizes.jsx';
import AddSize from './pages/AddSize.jsx';
import EditSize from './pages/EditSize.jsx';
import Materials from './pages/Materials';
import AddMaterial from './pages/AddMaterial';
import EditMaterial from './pages/EditMaterial';
import ProductMaterials from './pages/ProductMaterials';
import AddProductMaterial from './pages/AddProductMaterial';
import EditProductMaterial from './pages/EditProductMaterial';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6 space-y-6">
          <Breadcrumb />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/products/view/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/add" element={<AddCategory />} />
            <Route path="/categories/edit/:id" element={<EditCategory />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brands/add" element={<AddBrand />} />
            <Route path="/brands/edit/:id" element={<EditBrand />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/add" element={<AddDepartment />} />
            <Route path="/departments/edit/:id" element={<EditDepartment />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/countries/add" element={<AddCountry />} />
            <Route path="/countries/edit/:id" element={<EditCountry />} />
            <Route path="/states" element={<States />} />
            <Route path="/states/add" element={<AddState />} />
            <Route path="/states/edit/:id" element={<EditState />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/cities/add" element={<AddCity />} />
            <Route path="/cities/edit/:id" element={<EditCity />} />
            <Route path="/colors" element={<Colors />} />
            <Route path="/colors/add" element={<AddColor />} />
            <Route path="/colors/edit/:id" element={<EditColor />} />
            <Route path="/sizes" element={<Sizes />} />
            <Route path="/sizes/add" element={<AddSize />} />
            <Route path="/sizes/edit/:id" element={<EditSize />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/materials/add" element={<AddMaterial />} />
            <Route path="/materials/edit/:id" element={<EditMaterial />} />
            <Route path="/product-materials" element={<ProductMaterials />} />
            <Route path="/product-materials/add" element={<AddProductMaterial />} />
            <Route path="/product-materials/edit/:id" element={<EditProductMaterial />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App; 