import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import Image from "next/image";

const products = [
  {
    name: "Sports Shoes",
    sales: 10,
    sold: "$316.00",
    image: "/images/products/01.jpeg",
  },
  {
    name: "Black T-Shirt",
    sales: 20,
    sold: "$274.00",
    image: "/images/products/02.jpeg",
  },
  {
    name: "Jeans",
    sales: 15,
    sold: "$195.00",
    image: "/images/products/03.jpeg",
  },
  {
    name: "Red Sneakers",
    sales: 40,
    sold: "$402.00",
    image: "/images/products/04.jpeg",
  },
  {
    name: "Red Scarf",
    sales: 37,
    sold: "$280.00",
    image: "/images/products/05.jpeg",
  },
  {
    name: "Kitchen Accessory",
    sales: 18,
    sold: "$150.00",
    image: "/images/products/06.jpeg",
  },
  {
    name: "Bicycle",
    sales: 25,
    sold: "$316.00",
    image: "/images/products/07.jpeg",
  },
  {
    name: "Sports Shoes",
    sales: 12,
    sold: "$290.00",
    image: "/images/products/01.jpeg",
  },
];

export function BestSellingProductsTable() {
  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 lg:col-span-5">
      <CardHeader className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <CardTitle className="leading-none font-semibold">
          Best Selling Products
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
        <Input placeholder="Filter products..." className="max-w-xs" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    Sold
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    Sales
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      {/* Using basic img for simpler setup given the mock paths, Next Image would require handling domains/paths */}
                      <img
                        alt={product.name}
                        loading="lazy"
                        width="30"
                        height="30"
                        className="size-8 rounded-md object-cover"
                        src={product.image}
                      />
                      <div className="capitalize">{product.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.sold}</TableCell>
                  <TableCell>{product.sales}</TableCell>
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
                        <DropdownMenuItem>View product</DropdownMenuItem>
                        <DropdownMenuItem>View sales</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <div className="text-muted-foreground flex-1 text-sm">
            0 of 8 row(s) selected.
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
