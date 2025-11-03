"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { MarketListings } from "./MarketListings";
import { MyListings } from "./MyListings";
import { PurchaseHistory } from "./PurchaseHistory";
import { SalesHistory } from "./SalesHistory";

export function MarketTabs() {
  const [activeTab, setActiveTab] = useState("market");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="market">出品一覧</TabsTrigger>
        <TabsTrigger value="myListings">自分の出品</TabsTrigger>
        <TabsTrigger value="purchases">購入履歴</TabsTrigger>
        <TabsTrigger value="sales">販売履歴</TabsTrigger>
      </TabsList>

      <TabsContent value="market" className="bg-white/50 rounded-lg shadow-lg">
        <MarketListings />
      </TabsContent>

      <TabsContent value="myListings" className="bg-white/50 rounded-lg shadow-lg">
        <MyListings />
      </TabsContent>

      <TabsContent value="purchases" className="bg-white/50 rounded-lg shadow-lg">
        <PurchaseHistory />
      </TabsContent>

      <TabsContent value="sales" className="bg-white/50 rounded-lg shadow-lg">
        <SalesHistory />
      </TabsContent>
    </Tabs>
  );
}
