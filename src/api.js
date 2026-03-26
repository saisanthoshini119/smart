// Use a single API host for the whole frontend.
// Set REACT_APP_API_URL in your .env file for local/dev/prod environments.
const BASE_URL = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

export default BASE_URL;
