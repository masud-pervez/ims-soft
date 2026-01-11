import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecentOrder } from "@/api/dashboard";

interface RecentSalesProps {
  orders: RecentOrder[];
}

export function RecentSales({ orders }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>
              {order.customer
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.customer}</p>
            <p className="text-sm text-muted-foreground">{order.id}</p>
          </div>
          <div className="ml-auto font-medium">
            +BDT {order.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
