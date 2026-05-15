export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  console.log(`[Analytics] ${eventName}`, data || {});
  
  // Example implementation for GTM/GA4:
  // if (typeof window !== 'undefined' && (window as any).dataLayer) {
  //   (window as any).dataLayer.push({ event: eventName, ...data });
  // }
};
