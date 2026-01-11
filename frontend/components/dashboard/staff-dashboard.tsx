"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/dashboard";
import { MetricCard } from "./metric-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, AlertTriangle, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function StaffDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["staffStats"],
    queryFn: dashboardApi.getStaffStats,
  });

  if (!stats) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Staff Overview</h2>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Today's Orders"
          value={stats.totalOrders}
          description="Orders processed today"
          icon={ShoppingCart}
        />
        <MetricCard
          title="Low Stock Items"
          value={stats.lowStockCount}
          description="Products below min stock"
          icon={AlertTriangle}
        />
        <MetricCard
          title="Daily Sales"
          value={`BDT ${stats.totalRevenue}`}
          description="Sales recorded today"
          icon={Package}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you perform daily.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/inventory">
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
              </Button>
            </Link>
            <Link href="/orders/sales">
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Process New Sale
              </Button>
            </Link>
            <Link href="/inventory/stock">
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Check Low Stock
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Urgent items requiring attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Using Stock Check</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.lowStockCount} items are low on stock
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Pending Orders</p>
                    <p className="text-sm text-muted-foreground">
                      3 new orders came in
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
