"use client";

import { DashboardHeader } from "./dashboard-header";
import { WelcomeBanner } from "./welcome-banner";
import { StatsCards } from "./stats-cards";
import { RevenueChart } from "./revenue-chart";
import { SalesByLocation } from "./sales-by-location";
import { RecentOrdersTable } from "./recent-orders-table";
import { BestSellingProductsTable } from "./best-selling-products";
import { StoreVisitsChart } from "./store-visits-chart";
import { CustomerReviews } from "./customer-reviews";

export function AdminDashboard() {
  return (
    <div className="bg-muted/40 flex flex-1 flex-col">
      <div className="@container/main p-(--content-padding) xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto">
        <div className="space-y-4">
          <DashboardHeader />

          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-12">
              <WelcomeBanner />
              <div className="md:col-span-12 lg:col-span-8">
                <div className="flex w-full items-center justify-center">
                  <StatsCards />
                </div>
              </div>
            </div>

            <div className="space-y-4 xl:grid xl:grid-cols-2 xl:gap-4 xl:space-y-0">
              <RevenueChart />
              <SalesByLocation />
            </div>

            <div className="space-y-4 xl:grid xl:grid-cols-12 xl:gap-4 xl:space-y-0">
              <StoreVisitsChart />
              <CustomerReviews />
            </div>

            <div className="space-y-4 xl:grid xl:grid-cols-12 xl:gap-4 xl:space-y-0">
              <RecentOrdersTable />
              <BestSellingProductsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
