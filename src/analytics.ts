import ReactGA from "react-ga";

const TRACKING_ID = "G-4H1R18RWCV"; // Replace with your actual tracking ID
ReactGA.initialize(TRACKING_ID);

export const trackPageView = (page: string) => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};
