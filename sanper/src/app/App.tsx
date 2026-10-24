import { AppRouter } from "./router";
import { runIntelligenceDemo } from "../features/intelligence/engine/intelligence.demo";

if (import.meta.env.DEV) {
  runIntelligenceDemo();
}

export function App() {
  return <AppRouter />;
}