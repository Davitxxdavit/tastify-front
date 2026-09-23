import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './features/auth/AuthProvider';
import { RequireAuth } from './features/auth/RequireAuth';
import { CartProvider } from './features/cart/CartProvider';
import { CartDrawer } from './components/CartDrawer';
import { ChatWidget } from './features/chat/components/ChatWidget';

// Route-level code splitting: each page is its own chunk
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Menu = lazy(() => import('./pages/Menu'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
              <Route path="orders" element={<RequireAuth><Orders /></RequireAuth>} />
              <Route path="orders/:orderId" element={<RequireAuth><OrderDetail /></RequireAuth>} />
              <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <CartDrawer />
          <ChatWidget />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
