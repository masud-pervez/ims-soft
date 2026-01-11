import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FolderUp } from "lucide-react";

export function SalesByLocation() {
  const locations = [
    {
      country: "Canada",
      growth: "+5.2%",
      percentage: 85,
      color: "text-green-500",
    },
    {
      country: "Greenland",
      growth: "+7.8%",
      percentage: 80,
      color: "text-green-500",
    },
    {
      country: "Russia",
      growth: "-2.1%",
      percentage: 63,
      color: "text-red-500",
    },
    {
      country: "China",
      growth: "+3.4%",
      percentage: 60,
      color: "text-green-500",
    },
    {
      country: "Australia",
      growth: "+1.2%",
      percentage: 45,
      color: "text-green-500",
    },
    {
      country: "Greece",
      growth: "+1%",
      percentage: 40,
      color: "text-green-500",
    },
  ];

  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 lg:col-span-6 xl:col-span-4">
      <CardHeader className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <CardTitle className="leading-none font-semibold relative">
          Sales by Location
          <div className="absolute end-0 top-0">
            <div>
              <Button variant="outline" size="sm" className="h-9 px-4 py-2">
                <FolderUp className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline">Export</span>
              </Button>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Income in the last 28 days
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-5">
          {locations.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.country}</span>
                  <Badge variant="outline" className={item.color}>
                    {item.growth}
                  </Badge>
                </div>
                <div className="text-sm">{item.percentage}%</div>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
