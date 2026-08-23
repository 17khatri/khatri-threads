"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: string;
  categoryId: string;
  images: {
    id: string;
    categoryId: string;
    url: string;
    altText: string | null;
  }[];
};

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
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
          {products.map((product) => {
            const image =
              product.images.find(
                (item) => item.categoryId === product.categoryId
              ) ?? product.images[0];
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  {image && (
                    <img
                      src={image.url}
                      alt={image.altText || product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-medium leading-5 sm:text-base">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-black">
                  ₹ {Number(product.price).toLocaleString("en-IN")}
                </p>
              </Link>
            );
          })}
        </div>
      )}
      {!loading && !products.length && (
        <p className="surface-message">No products are available yet.</p>
      )}
    </main>
  );
}
