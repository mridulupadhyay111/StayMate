// API Base URL
const API_URL = import.meta.env.VITE_API_URL;

// Agar env na mile (fallback for safety)
const FINAL_API_URL = API_URL || "http://localhost:8080";
console.log("VITE_API_URL =", API_URL);
console.log("FINAL_API_URL =", FINAL_API_URL);

export default FINAL_API_URL;