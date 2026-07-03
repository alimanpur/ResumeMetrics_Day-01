import { Outlet } from 'react-router'
import { SiteHeader } from "./SiteHeader.jsx";
import { SiteFooter } from "./SiteFooter.jsx";

export function MarketingLayout() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <main><Outlet /></main>
      <SiteFooter />
    </div>
  );
}
