// API Base URL
const API_URL = import.meta.env.VITE_API_URL;

// Agar env na mile (fallback for safety)
const FINAL_API_URL = API_URL || "http://localhost:8080";

export default FINAL_API_URL;