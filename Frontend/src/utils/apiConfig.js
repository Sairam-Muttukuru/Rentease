const raw_url = import.meta.env.VITE_API_URL || '';
const BASE_URL = (raw_url && !raw_url.includes('localhost')) ? raw_url : 'https://rentease-1-pwm5.onrender.com';

export default BASE_URL;
