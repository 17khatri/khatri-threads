"use client";

import { useEffect, useState } from "react";
import ProductCard, {
  type StorefrontProductCardData,
} from "@/app/components/storefront/product-card";

export default function CollectionPage() {
  const [products, setProducts] = useState<StorefrontProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/storefront/products", {
        cache: "no-store",
      });
      if (response.ok) setProducts(await response.json());
      setLoading(false);
    };
    void load();
  }, []);
  return (
    <main className="wide-shell mx-auto py-8 sm:py-12">
      {loading ? (
        <p className="text-black/60">Loading products…</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {!loading && !products.length && (
        <p className="surface-message">No products are available yet.</p>
      )}
    </main>
  );
}
