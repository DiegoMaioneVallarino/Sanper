import { Outlet } from "react-router-dom";

import { Header } from "../../components/navigation/Header/Header";
import { MarketTicker } from "../../components/navigation/MarketTicker/MarketTicker";

import "./MainLayout.css";

export function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <MarketTicker />

      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  );
}