"use client";

// Public storefront collections page.
import Image from "next/image";

export default function CollectionPage() {
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

  return (
    <main className="wide-shell mx-auto py-8 sm:py-12">
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
    </main>
  );
}
