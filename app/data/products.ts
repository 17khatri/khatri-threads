export type StorefrontProduct = {
  slug: string;
  name: string;
  price: string;
  image: string;
  images: string[];
  colors: { name: string; value: string }[];
  sizes: string[];
  description: string;
};

export const products: StorefrontProduct[] = [
  {
    slug: "textured-knit-cardigan",
    name: "Textured Knit Cardigan",
    price: "2,850",
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=90",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=90",
    ],
    colors: [
      { name: "Oatmeal", value: "#b6a89b" },
      { name: "Black", value: "#000000" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "A soft, easy layer with a textured knit finish for everyday comfort.",
  },
  {
    slug: "classic-turtleneck-top",
    name: "Classic Turtleneck Top",
    price: "1,490",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=90",
    ],
    colors: [{ name: "Cream", value: "#eee8dc" }, { name: "Black", value: "#000000" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "A clean turtleneck silhouette made to pair effortlessly with your wardrobe.",
  },
  {
    slug: "soft-wool-pullover",
    name: "Soft Wool Pullover",
    price: "2,330",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90",
    ],
    colors: [{ name: "Charcoal", value: "#3d3d3d" }, { name: "Ivory", value: "#f6f1e8" }],
    sizes: ["S", "M", "L", "XL"],
    description: "A warm wool-blend pullover designed with a relaxed and versatile fit.",
  },
  {
    slug: "striped-everyday-tee",
    name: "Striped Everyday Tee",
    price: "760",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90",
    ],
    colors: [{ name: "Navy", value: "#1c2d4a" }, { name: "White", value: "#ffffff" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A comfortable striped tee that makes getting dressed feel simple.",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
