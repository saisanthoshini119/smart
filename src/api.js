// Use a single API host for the whole frontend.
// Set REACT_APP_API_URL in your .env file for local/dev/prod environments.
const configuredApiUrl = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

const getDefaultApiUrl = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  const { protocol, hostname } = window.location;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isLocalhost) {
    return 'http://localhost:10000';
  }

  return `${protocol}//${window.location.host}`;
};

const BASE_URL = configuredApiUrl || getDefaultApiUrl();

export default BASE_URL;
