import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AllBlogPostsPage } from './pages/AllBlogPostsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { GeneratorsPage } from './pages/GeneratorsPage';
import { AdditionGenerator } from './pages/generators/AdditionGenerator';
import { SubtractionGenerator } from './pages/generators/SubtractionGenerator';
import { MultiplicationGenerator } from './pages/generators/MultiplicationGenerator';
import { DivisionGenerator } from './pages/generators/DivisionGenerator';
import { NameTracingGenerator } from './pages/generators/NameTracingGenerator';
import { NameTracingColoringGenerator } from './pages/generators/NameTracingColoringGenerator';
import AlphabetTracingGenerator from './pages/generators/AlphabetTracingGenerator';
import CategoryPage from './pages/CategoryPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { CartProvider } from './contexts/CartContext';
import { AdminProvider } from './contexts/AdminContext';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import DashboardHome from './pages/admin/DashboardHome';
import ProductsManagement from './pages/admin/ProductsManagement';
import BlogManagement from './pages/admin/BlogManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import MessagesView from './pages/admin/MessagesView';
import ImageGallery from './pages/admin/ImageGallery';
import SettingsPage from './pages/admin/SettingsPage';

function App() {
  return (
    <Router>
      <AdminProvider>
        <CartProvider>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/*" element={<AdminDashboard />}>
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="products" element={<ProductsManagement />} />
              <Route path="blog" element={<BlogManagement />} />
              <Route path="categories" element={<CategoriesManagement />} />
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="messages" element={<MessagesView />} />
              <Route path="media" element={<ImageGallery />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={
              <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/generators" element={<GeneratorsPage />} />
                    <Route path="/generator/addition" element={<AdditionGenerator />} />
                    <Route path="/generator/subtraction" element={<SubtractionGenerator />} />
                    <Route path="/generator/multiplication" element={<MultiplicationGenerator />} />
                    <Route path="/generator/division" element={<DivisionGenerator />} />
                    <Route path="/generator/alphabet-tracing" element={<AlphabetTracingGenerator />} />
                    <Route path="/generator/name-tracing" element={<NameTracingGenerator />} />
                    <Route path="/generator/name-tracing-coloring" element={<NameTracingColoringGenerator />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/shop/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                    <Route path="/blog" element={<AllBlogPostsPage />} />
                    <Route path="/blog/:id" element={<BlogPostPage />} />
                    <Route path="/category" element={<CategoryPage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </CartProvider>
      </AdminProvider>
    </Router>
  );
}

export default App;
