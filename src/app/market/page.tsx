import { MarketHeader } from "../../../features/market/components/MarketHeader";
import { MarketTabs } from "../../../features/market/components/MarketTabs";

export default function Market() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <MarketHeader />

      <main className="container mx-auto px-4 py-8">
        <MarketTabs />
      </main>
    </div>
  );
}
