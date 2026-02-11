// Umami analytics - script loaded via index.html
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export const trackPageView = (page: string) => {
  window.umami?.track('pageview', { url: page });
};

export const trackEvent = (event: string, data?: Record<string, unknown>) => {
  window.umami?.track(event, data);
};
