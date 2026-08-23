import Link from "next/link";

export type StorefrontProductCardData = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  price: string;
  categoryId: string;
  collection?: { name: string } | null;
  images: {
    id: string;
    categoryId: string;
    url: string;
    altText: string | null;
  }[];
};

export default function ProductCard({ product }: { product: StorefrontProductCardData }) {
  const image =
    product.images.find((item) => item.categoryId === product.categoryId) ??
    product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
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
        {product.collection && (
          <span>
            {" | "}
            {product.collection.name}
          </span>
        )}
      </h3>
      {product.description && (
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-black/60">
          {product.description}
        </p>
      )}
      <p className="mt-2 text-sm font-semibold text-black">
        ₹ {Number(product.price).toLocaleString("en-IN")}
      </p>
    </Link>
  );
}
