// Google Analytics utility
const GA_MEASUREMENT_ID = 'G-KXCB72H0DX';

export const initializeGA = () => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(arguments);
  }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
};

export const trackPageView = (pageName: string) => {
  if (!(window as any).gtag) return;
  (window as any).gtag('event', 'page_view', {
    page_title: pageName,
    page_path: `/${pageName.toLowerCase()}`,
  });
};

export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (!(window as any).gtag) return;
  (window as any).gtag('event', eventName, eventData || {});
};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
