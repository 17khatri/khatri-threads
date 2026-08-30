"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: string;
  description: string | null;
  categoryId: string;
  category: { id: string; name: string };
  categories: {
    categoryId: string;
    isDefault: boolean;
    category: { id: string; name: string };
  }[];
  images: {
    id: string;
    categoryId: string;
    url: string;
    altText: string | null;
  }[];
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/storefront/products/${slug}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) return setError(data.error || "Product not found.");
      setProduct(data);
      setSelectedCategoryId(data.categoryId);
    };
    void load();
  }, [slug]);
  const images = useMemo(
    () =>
      product?.images.filter(
        (image) => image.categoryId === selectedCategoryId
      ) ?? [],
    [product, selectedCategoryId]
  );
  if (error)
    return (
      <main className="wide-shell mx-auto py-16">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Link
          href="/collections"
          className="mt-4 inline-block text-primary-strong"
        >
          Browse products
        </Link>
      </main>
    );
  if (!product)
    return (
      <main className="wide-shell mx-auto py-16 text-black/60">
        Loading product…
      </main>
    );
  const selectedCategory = product.categories.find(
    (item) => item.categoryId === selectedCategoryId
  )?.category;
  return (
    <main className="wide-shell mx-auto py-6 sm:py-10 lg:py-12">
      <Link
        href="/collections"
        className="mb-6 inline-flex text-sm font-medium text-black/60 hover:text-black"
      >
        ← Back to shop
      </Link>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)] lg:gap-12">
        <section className="grid gap-3 sm:grid-cols-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
            >
              <img
                src={image.url}
                alt={
                  image.altText ||
                  `${product.name}, ${
                    selectedCategory?.name ?? "product"
                  } view ${index + 1}`
                }
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </section>
        <section className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg font-medium">
            ₹ {Number(product.price).toLocaleString("en-IN")}
          </p>
          {product.description && (
            <p className="mt-5 max-w-lg text-sm leading-6 text-black/65">
              {product.description}
            </p>
          )}
          <div className="mt-7 border-t border-black/10 pt-7">
            <p className="text-sm font-medium">
              Style{" "}
              <span className="ml-1 text-black/60">
                {selectedCategory?.name}
              </span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.categories.map((item) => (
                <button
                  key={item.categoryId}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(item.categoryId);
                    setAdded(false);
                  }}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${
                    selectedCategoryId === item.categoryId
                      ? "border-black bg-black text-white"
                      : "border-black/15 hover:border-black"
                  }`}
                  aria-pressed={selectedCategoryId === item.categoryId}
                >
                  {item.category.name}
                </button>
              ))}
            </div>
            <div className="mt-7 flex gap-3">
              <div className="flex h-[52px] min-w-32 items-center justify-between rounded-xl border border-black/15 px-3">
                <button
                  type="button"
                  className="px-2 text-lg text-black/60 hover:text-black"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-sm font-medium" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="px-2 text-lg text-black/60 hover:text-black"
                  onClick={() => setQuantity((current) => current + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => setAdded(true)}
                className="h-[52px] flex-1 rounded-xl bg-black px-5 text-sm font-semibold text-white hover:bg-black/80"
              >
                {added ? "Added to cart" : "Add to cart"}
              </button>
            </div>
            {added && (
              <p className="mt-3 text-sm text-success" role="status">
                {quantity} item{quantity > 1 ? "s" : ""} added to your cart.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
