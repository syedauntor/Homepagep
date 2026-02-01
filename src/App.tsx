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
import { NameTracingGenerator } from './pages/generators/NameTracingGenerator';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/generators" element={<GeneratorsPage />} />
            <Route path="/generator/addition" element={<AdditionGenerator />} />
            <Route path="/generator/subtraction" element={<SubtractionGenerator />} />
            <Route path="/generator/name-tracing" element={<NameTracingGenerator />} />
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
    </Router>
  );
}

export default App;
