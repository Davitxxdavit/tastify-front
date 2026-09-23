import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import { AuthProvider } from './features/auth/AuthProvider';
import { RequireAuth } from './features/auth/RequireAuth';
import { CartProvider } from './features/cart/CartProvider';
import { CartDrawer } from './components/CartDrawer';
import { ChatWidget } from './features/chat/components/ChatWidget';

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
              {/* 404 Route */}
              <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
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
