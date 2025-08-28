// File: src/utils/api.js

// const BASE_API_URL = 'https://api.franmaxindia.com/';
// const BASE_IMAGE_URL = 'https://api.franmaxindia.com/uploads/';
const BASE_API_URL = 'http://localhost/react-api/';
const BASE_IMAGE_URL = 'http://localhost/react-api/uploads/';

export const getApiUrl = (endpoint) => `${BASE_API_URL}/${endpoint}`;
export const getImageUrl = (imagePath) => `${BASE_IMAGE_URL}${imagePath}`;
