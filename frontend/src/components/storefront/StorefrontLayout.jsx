import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Main Layout for the Public Storefront
 * Wraps all storefront pages with a consistent UI shell.
 */
export default function StorefrontLayout() {
  return (
    <div className="storefront-shell flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
