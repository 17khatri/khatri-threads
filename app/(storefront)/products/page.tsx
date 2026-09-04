"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FormField, Input } from "@/app/components/form-fields";
import ProductCard, {
  type StorefrontProductCardData,
} from "@/app/components/storefront/product-card";

type Collection = { id: string; name: string };

export default function ProductsPage() {
  const [products, setProducts] = useState<StorefrontProductCardData[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsResponse, collectionsResponse] = await Promise.all([
          fetch("/api/storefront/products", { cache: "no-store" }),
          fetch("/api/storefront/collections", { cache: "no-store" }),
        ]);

        if (productsResponse.ok) setProducts(await productsResponse.json());
        if (collectionsResponse.ok)
          setCollections(await collectionsResponse.json());
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();

    return products.filter((product) => {
      const matchesCollection =
        !selectedCollectionId ||
        product.collection?.id === selectedCollectionId;
      const searchableText = [
        product.name,
        product.description,
        product.collection?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return matchesCollection && (!query || searchableText.includes(query));
    });
  }, [products, searchQuery, selectedCollectionId]);

  return (
    <main className="wide-shell mx-auto py-4">
      <div className="mb-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_16rem]">
        <FormField icon={<FiSearch aria-hidden="true" size={18} />}>
          <Input
            type="search"
            aria-label="Search products"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products"
            className="w-full border border-black/15 bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-black/45 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </FormField>
        <label className="block">
          <span className="sr-only">Filter by collection</span>
          <select
            value={selectedCollectionId}
            onChange={(event) => setSelectedCollectionId(event.target.value)}
            className="w-full cursor-pointer border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All collections</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-black/60">Loading products…</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {!loading && !filteredProducts.length && (
        <p className="surface-message">
          {products.length
            ? "No products match your search or selected collection."
            : "No products are available yet."}
        </p>
      )}
    </main>
  );
}
