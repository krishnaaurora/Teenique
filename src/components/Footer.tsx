import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="site-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-bold text-lg mb-2">Teenique</h4>
            <p className="text-sm text-[#6b7280]">Elegance Redefined for Gen-Z — curated styles, ethical production.</p>
          </div>

          <div className="flex justify-between md:justify-center">
            <ul className="space-y-2">
              <li className="font-semibold">Shop</li>
              <li><a href="/collections" className="text-sm text-[#6b7280] hover:text-[#111827]">Collections</a></li>
              <li><a href="/gallery" className="text-sm text-[#6b7280] hover:text-[#111827]">Style Gallery</a></li>
              <li><a href="/checkout" className="text-sm text-[#6b7280] hover:text-[#111827]">Checkout</a></li>
            </ul>
          </div>

          <div className="text-left md:text-right">
            <p className="font-semibold">Contact</p>
            <p className="text-sm text-[#6b7280]">support@teenique.example</p>
            <p className="text-sm text-[#6b7280]">+91 98xxxxxxx</p>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4 text-sm text-[#6b7280] flex flex-col md:flex-row md:justify-between gap-3">
          <span>© {new Date().getFullYear()} Teenique. All rights reserved.</span>
          <span className="flex gap-3">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Returns</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
