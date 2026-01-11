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
import { Plus, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";

import { ProductFormModal } from "@/components/inventory/product-form-modal";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    data: products,
    isLoading,
    isError,
  } = useFetchData<Product[]>({
    url: "/products",
    params: { search },
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your products and stock levels.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/inventory/stock">
            <Button variant="outline">Stock Management</Button>
          </Link>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
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
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-24 text-red-500"
                >
                  Failed to load products.
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              // Safe check since API might return wrapped data, but assuming array based on types
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.categoryId}</TableCell>{" "}
                  {/* Mapping ID for now, later expand to Name */}
                  <TableCell>${(product.price || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          product.stock <= product.minStock
                            ? "text-red-500 font-bold"
                            : ""
                        }
                      >
                        {product.stock}
                      </span>
                      {product.stock <= product.minStock && (
                        <Badge
                          variant="destructive"
                          className="h-5 px-1 text-[10px]"
                        >
                          Low
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "active" ? "default" : "secondary"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={selectedProduct}
      />
    </div>
  );
}
