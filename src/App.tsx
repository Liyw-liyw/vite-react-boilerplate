import { useUpdateEffect } from 'ahooks';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import ErrorPage from './pages/errorPage';
import Home from './pages/home';

function App() {
  const { pathname } = useLocation();

  useUpdateEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
