import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  return (
    <header className="flex justify-end items-center p-4 bg-white border-b">
      <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </header>
  );
};
export default Navbar;