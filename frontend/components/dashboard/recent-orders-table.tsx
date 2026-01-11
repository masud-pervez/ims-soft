import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FolderUp,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const orders = [
  {
    id: "#1023",
    customer: "Theodore Bell",
    avatar: "/images/avatars/01.png",
    product: "Tire Doodad",
    amount: "$300.00",
    status: "processing",
    statusColor:
      "border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-900/70 dark:text-white/80",
  },
  {
    id: "#2045",
    customer: "Amelia Grant",
    avatar: "/images/avatars/02.png",
    product: "Engine Kit",
    amount: "$450.00",
    status: "paid",
    statusColor:
      "border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-900/70 dark:text-white/80",
  },
  {
    id: "#3067",
    customer: "Eleanor Ward",
    avatar: "/images/avatars/03.png",
    product: "Brake Pad",
    amount: "$200.00",
    status: "success",
    statusColor:
      "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
  },
  {
    id: "#4089",
    customer: "Henry Carter",
    avatar: "/images/avatars/04.png",
    product: "Fuel Pump",
    amount: "$500.00",
    status: "processing",
    statusColor:
      "border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-900/70 dark:text-white/80",
  },
  {
    id: "#5102",
    customer: "Olivia Harris",
    avatar: "/images/avatars/05.png",
    product: "Steering Wheel",
    amount: "$350.00",
    status: "failed",
    statusColor:
      "border-red-400 bg-red-50 text-red-800 dark:bg-red-900/70 dark:text-white/80",
  },
  {
    id: "#6123",
    customer: "James Robinson",
    avatar: "/images/avatars/06.png",
    product: "Air Filter",
    amount: "$180.00",
    status: "paid",
    statusColor:
      "border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-900/70 dark:text-white/80",
  },
  {
    id: "#7145",
    customer: "Sophia Martinez",
    avatar: "/images/avatars/07.png",
    product: "Oil Filter",
    amount: "$220.00",
    status: "success",
    statusColor:
      "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
  },
  {
    id: "#8167",
    customer: "Liam Thompson",
    avatar: "/images/avatars/08.png",
    product: "Radiator Cap",
    amount: "$290.00",
    status: "processing",
    statusColor:
      "border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-900/70 dark:text-white/80",
  },
];

export function RecentOrdersTable() {
  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 lg:col-span-7">
      <CardHeader className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <CardTitle className="leading-none font-semibold">
          Recent Orders
        </CardTitle>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end relative">
          <div className="absolute end-0 top-0">
            <Button variant="outline" size="sm" className="h-9 px-4 py-2">
              <FolderUp className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 space-y-4">
        <Input placeholder="Filter orders..." className="max-w-xs" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    Amount
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                    >
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="size-8">
                        <AvatarImage src={order.avatar} alt={order.customer} />
                        <AvatarFallback>
                          {order.customer.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="capitalize">{order.customer}</div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{order.product}</TableCell>
                  <TableCell className="font-medium">{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${order.statusColor}`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Download invoice</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Showing 1 to 8 of 16 entries
          </p>
          <div className="space-x-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
