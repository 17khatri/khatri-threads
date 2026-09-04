"use client";

import Button from "@/app/components/button";
import logo from "../../public/logo.jpeg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ROUTES from "@/helper/routes";
import ProductCard, {
  type StorefrontProductCardData,
} from "@/app/components/storefront/product-card";

export default function Page() {
  const router = useRouter();
  const [products, setProducts] = useState<StorefrontProductCardData[]>([]);

  const navigateToCollections = () => {
    router.push(ROUTES.SHOP);
  };

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetch("/api/storefront/products?featured=true", {
        cache: "no-store",
      });
      if (response.ok) setProducts(await response.json());
    };
    void loadProducts();
  }, []);
  return (
    <main className="min-h-screen bg-white text-black">
      <section>
        <div className="grid overflow-hidden md:grid-cols-[2fr_3fr]">
          <div className="relative hidden bg-white md:flex md:items-center md:justify-center">
            <Image
              src={logo}
              alt="Khatri Threads logo"
              width={250}
              height={250}
            />
          </div>

          <div className="flex items-center bg-white px-7 py-8 sm:px-12 lg:px-14">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">
                New arrivals
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Fresh styles for every day.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-black/65 sm:text-base">
                Explore the latest Khatri Threads collection, made for comfort,
                confidence, and effortless style.
              </p>
              <div className="mt-5">
                <Button
                  onClick={navigateToCollections}
                  className="rounded-none px-7 py-2"
                >
                  Shop now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collection">
        <div className="wide-shell mx-auto">
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Shop by Mood
              </p>

              <span
                onClick={navigateToCollections}
                className="text-sm font-semibold cursor-pointer text-black/60 sm:hidden"
              >
                View All
              </span>
            </div>

            <div className="mt-2 flex items-end justify-between">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Find your next favourite
              </h2>

              <span
                onClick={navigateToCollections}
                className="hidden cursor-pointer text-sm font-semibold text-black/60 sm:block"
              >
                View All
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
