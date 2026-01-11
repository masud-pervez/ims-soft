"use client";

import { useFetchData } from "@/hooks/useFetchData";
import { Product } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { productApi } from "@/api/products";
import { useQueryClient } from "@tanstack/react-query";

export default function StockPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const {
    data: products,
    isLoading,
    isError,
  } = useFetchData<Product[]>({
    url: "/products",
    params: { search },
  });

  const handleAdjustStock = async (
    id: string,
    currentStock: number,
    adjustment: number
  ) => {
    // This assumes we have an API to adjust stock or we simulate it via update
    // Ideally we should have /products/:id/stock endpoint
    // For now I'll use product update
    try {
      const newStock = Math.max(0, currentStock + adjustment);
      await productApi.update(id, { stock: newStock });
      toast.success(
        `Stock ${adjustment > 0 ? "added" : "removed"}. New Stock: ${newStock}`
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch {
      toast.error("Failed to update stock");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Stock Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and adjust product stock levels.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead className="text-right">Quick Adjust</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-red-500"
                >
                  Failed to load products.
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.categoryId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          product.stock <= product.minStock
                            ? "text-red-500 font-bold"
                            : "font-semibold"
                        }
                      >
                        {product.stock}
                      </span>
                      {product.stock <= product.minStock && (
                        <Badge
                          variant="destructive"
                          className="h-5 px-1 text-[10px]"
                        >
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Min: {product.minStock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleAdjustStock(product.id, product.stock, 1)
                        }
                      >
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleAdjustStock(product.id, product.stock, -1)
                        }
                      >
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
