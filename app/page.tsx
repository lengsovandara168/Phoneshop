"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import ProductCard from "@/components/ui/ProductCard";
import AddProduct from "./lib/AddProduct";
import { Spinner } from "@/components/ui/spinner";

type Product = {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  rating?: number;
  description?: string;
};

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(
    "https://dummyjson.com/products/category/smartphones"
  );
  if (!res.ok) {
    throw new Error("Fetch product is failed");
  }
  const json = await res.json();
  return json.products;
}

// testing
fetchProducts()
  .then((products) => {
    console.log("✅ Products fetched successfully:");
    console.table(products);
  })
  .catch((err) => {
    console.error("❌ Error:", err.message);
  });

export default function ProductPage() {
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  //Prevents duplicate React keys (in case the API or re-render duplicates data).
  const products = useMemo(() => {
    const productID = new Set<number>();
    return (data ?? []).filter((p) => {
      if (productID.has(p.id)) return false;
      productID.add(p.id);
      return true;
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner/>
      </div>
    );
  }
  if (error)
    return (
      <p className="p-8 text-red-600 bg-gray-50 text-center">
        Failed to load products.
      </p>
    );

  return (
    <main className="min-h-screen bg-white text-gray-900 p-8">
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Dara Phoneshop
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Explore the latest smartphones — minimal, clean, and premiumm.
          </p>
        </div>

        <AddProduct />
      </header>

      {/* Product Grid  */}
      <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </main>
  );
}
