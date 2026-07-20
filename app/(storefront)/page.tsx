"use client";

import Button from "@/app/components/button";
import logo from "../../public/logo.jpeg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ROUTES from "@/helper/routes";

const collections = [
  {
    name: "Textured Knit Cardigan",
    price: "2,850",
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Classic Turtleneck Top",
    price: "1,490",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Soft Wool Pullover",
    price: "2,330",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Striped Everyday Tee",
    price: "760",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
  },
];

export default function Page() {
  const router = useRouter();

  const navigateToCollections = () => {
    router.push(ROUTES.COLLECTIONS);
  };
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-strong">
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
            {collections.map((collection) => (
              <article key={collection.name} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 639px) 50vw, (max-width: 767px) 50vw, 25vw"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="mt-3 text-sm font-medium leading-5 sm:text-base">
                  {collection.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-black">
                  &#8377; {collection.price}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
