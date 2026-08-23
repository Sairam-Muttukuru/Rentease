import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css'
import App from './App.jsx'
import './i18n';
import axios from 'axios';
import BASE_URL from './utils/apiConfig';

axios.defaults.baseURL = BASE_URL;
console.log("Axios Global BaseURL set to:", axios.defaults.baseURL);

// --- CLEAN JSON API RESPONSE LOGGER ---
axios.interceptors.response.use(
  response => {
    if (response.config?.url) {
      try {
        const endpoint = new URL(response.config.url, axios.defaults.baseURL).pathname;
        console.log(`✅ [API: ${endpoint}]`);
        console.log(JSON.stringify(response.data, null, 2));
      } catch(e) {
        console.log(JSON.stringify(response.data, null, 2));
      }
    }
    return response;
  },
  error => {
    if (error.config?.url) {
      try {
        const endpoint = new URL(error.config.url, axios.defaults.baseURL).pathname;
        console.error(`❌ [API ERR: ${endpoint}]`);
        console.log(JSON.stringify(error.response?.data || error.message, null, 2));
      } catch(e) {}
    }
    return Promise.reject(error);
  }
);

// Fallback for native fetch calls
const originalFetch = window.fetch;
window.fetch = async function (...args) {
  try {
    const response = await originalFetch.apply(this, args);
    const urlStr = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
    if (urlStr.includes('/api/')) {
      try {
        const cloned = response.clone();
        cloned.json().then(data => {
          try {
            const urlObj = new URL(urlStr, window.location.origin);
            console.log(`✅ [FETCH: ${urlObj.pathname}]`);
            console.log(JSON.stringify(data, null, 2));
          } catch(e) {}
        }).catch(() => {});
      } catch(e) {}
    }
    return response;
  } catch (err) {
    throw err;
  }
};


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
