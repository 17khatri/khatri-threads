// Public storefront collections page.
import Image from "next/image";
import Link from "next/link";
import { products } from "@/app/data/products";

export default function CollectionPage() {
  return (
    <main className="wide-shell mx-auto py-8 sm:py-12">
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 639px) 50vw, (max-width: 767px) 50vw, 25vw"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <h3 className="mt-3 text-sm font-medium leading-5 sm:text-base">
              {product.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-black">
              &#8377; {product.price}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
