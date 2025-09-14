import api from './api';

// NOTE: You need to create this admin login endpoint on your backend
export const adminLogin = async (email, password) => {
  // This is a placeholder. Your backend will handle the actual logic.
  if (email === "admin@sentinel.com" && password === "password") {
      // In a real app, the token comes from the server
      return { token: "fake-admin-jwt-token" };
  }
  throw new Error("Invalid credentials");
};