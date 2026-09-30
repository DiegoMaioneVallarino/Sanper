import { HeroNews } from "../../features/news/components/HeroNews/HeroNews";

import { GlobalOverview } from "../../features/global-map/components/GlobalOverview/GlobalOverview";

import { DeepAnalysis } from "../../features/news/components/DeepAnalysis/DeepAnalysis";

import { LatestAnalysis } from "../../features/news/components/LatestAnalysis/LatestAnalysis";

import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home-page">
      <HeroNews />

      <GlobalOverview />

      <DeepAnalysis />

      <LatestAnalysis />
    </div>
  );
}