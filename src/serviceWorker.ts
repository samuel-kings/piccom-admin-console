export const registerSW = async () => {
  // Only register service worker in production
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registration successful');
      return registration;
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  }
  return null;
};