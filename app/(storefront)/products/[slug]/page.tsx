"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { getProduct } from "@/app/data/products";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const product = getProduct(params.slug);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) notFound();

  return (
    <main className="wide-shell mx-auto py-6 sm:py-10 lg:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex text-sm font-medium text-black/60 hover:text-black"
      >
        ← Back to shop
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)] lg:gap-12">
        <section className="grid gap-3 sm:grid-cols-2">
          {product.images.map((productImage, index) => (
            <button
              key={productImage}
              type="button"
              onClick={() => setActiveImage(index)}
              className={`relative aspect-[4/5] overflow-hidden bg-neutral-100 text-left ${
                activeImage === index ? "ring-2 ring-black ring-offset-2" : ""
              }`}
              aria-label={`View ${product.name} image ${index + 1}`}
            >
              <Image
                src={productImage}
                alt={`${product.name}, view ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 42vw"
                className="object-cover"
              />
            </button>
          ))}
        </section>

        <section className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Khatri Threads
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg font-medium">₹ {product.price}</p>
          <p className="mt-5 max-w-lg text-sm leading-6 text-black/65">
            {product.description}
          </p>

          <div className="mt-7 border-t border-black/10 pt-7">
            <p className="text-sm font-medium">
              Color{" "}
              <span className="ml-1 text-black/60">
                {product.colors[selectedColor].name}
              </span>
            </p>
            <div className="mt-3 flex gap-3">
              {product.colors.map((color, index) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(index)}
                  className={`grid h-10 w-10 place-items-center rounded-full border ${
                    selectedColor === index
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label={`Select ${color.name}`}
                  aria-pressed={selectedColor === index}
                >
                  <span
                    className="h-8 w-8 rounded-full border border-black/20"
                    style={{ backgroundColor: color.value }}
                  />
                </button>
              ))}
            </div>

            <p className="mt-7 text-sm font-medium">Size</p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 rounded-xl border text-sm font-medium ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-black/15 hover:border-black"
                  }`}
                  aria-pressed={selectedSize === size}
                >
                  {size}
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
