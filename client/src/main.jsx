import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import AppLayout from './components/AppLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminErrorBoundary from './components/AdminErrorBoundary.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Gallery from './pages/Gallery.jsx';
import Wishlist from './pages/Wishlist.jsx';
import DeliveryInfo from './pages/DeliveryInfo.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import StyleFinder from './pages/StyleFinder.jsx';
import Gifts from './pages/Gifts.jsx';
import Services from './pages/Services.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminOrderDetails from './pages/admin/AdminOrderDetails.jsx';
import AdminCategoriesCoupons from './pages/admin/AdminCategoriesCoupons.jsx';
import AdminGallery from './pages/admin/AdminGallery.jsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';
import AdminTestimonials from './pages/admin/AdminTestimonials.jsx';
import AdminSales from './pages/admin/AdminSales.jsx';
import AdminCustomers from './pages/admin/AdminCustomers.jsx';
import AdminPromos from './pages/admin/AdminPromos.jsx';
import AdminStockAlerts from './pages/admin/AdminStockAlerts.jsx';
import './styles.css';

const Protected = ({ children }) => {
  const token = localStorage.getItem('jf_admin_token');
  return token ? children : <Navigate to="/admin/login" replace />;
};

const AdminApp = () => (
  <Protected>
    <AdminErrorBoundary>
      <AdminLayout />
    </AdminErrorBoundary>
  </Protected>
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <WishlistProvider>
        <CartProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/services" element={<Services />} />
              <Route path="/wholesale" element={<Navigate to="/" replace />} />
              <Route path="/style-finder" element={<StyleFinder />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/delivery" element={<DeliveryInfo />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminApp />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetails />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="sales" element={<AdminSales />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="promos" element={<AdminPromos />} />
              <Route path="stock-alerts" element={<AdminStockAlerts />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="settings" element={<AdminCategoriesCoupons />} />
            </Route>
          </Routes>
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
