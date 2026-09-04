"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import Button from "@/app/components/button";
import { Modal } from "@/app/components/modal";
import {
  Checkbox,
  FormField,
  Input,
  Textarea,
} from "@/app/components/form-fields";
import { H3, P } from "@/app/components/typography";

type Master = { id: string; name: string };
type ProductImage = {
  categoryId: string;
  url: string;
  storagePath: string | null;
};
type Product = {
  id: string;
  name: string;
  sku: string | null;
  price: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  description: string | null;
  isFeatured: boolean;
  categoryId: string;
  collectionId: string | null;
  category: Master;
  collection: Master | null;
  categories: { categoryId: string; isDefault: boolean; category: Master }[];
  images: ProductImage[];
};
type ProductForm = {
  name: string;
  sku: string;
  price: string;
  description: string;
  collectionId: string;
  status: Product["status"];
  isFeatured: boolean;
  categoryIds: string[];
  defaultCategoryId: string;
  images: ProductImage[];
};
const blank: ProductForm = {
  name: "",
  sku: "",
  price: "",
  description: "",
  collectionId: "",
  status: "DRAFT",
  isFeatured: false,
  categoryIds: [],
  defaultCategoryId: "",
  images: [],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Master[]>([]);
  const [collections, setCollections] = useState<Master[]>([]);
  const [form, setForm] = useState<ProductForm>(blank);
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const load = async () => {
    const [productResponse, categoryResponse, collectionResponse] =
      await Promise.all([
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
        fetch("/api/collections", { cache: "no-store" }),
      ]);
    if (productResponse.ok) setProducts(await productResponse.json());
    if (categoryResponse.ok) setCategories(await categoryResponse.json());
    if (collectionResponse.ok) setCollections(await collectionResponse.json());
  };
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const change = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const openCreate = () => {
    setEditing(null);
    setForm(blank);
    setFiles({});
    setError("");
    setOpen(true);
  };
  const openEdit = (product: Product) => {
    setEditing(product);
    setFiles({});
    setForm({
      name: product.name,
      sku: product.sku ?? "",
      price: product.price,
      description: product.description ?? "",
      collectionId: product.collectionId ?? "",
      status: product.status,
      isFeatured: product.isFeatured,
      categoryIds: product.categories.map((item) => item.categoryId),
      defaultCategoryId: product.categoryId,
      images: product.images,
    });
    setError("");
    setOpen(true);
  };
  const setCategory = (categoryId: string, checked: boolean) =>
    setForm((current) => {
      const categoryIds = checked
        ? [...current.categoryIds, categoryId]
        : current.categoryIds.filter((id) => id !== categoryId);
      const defaultCategoryId = checked
        ? current.defaultCategoryId || categoryId
        : current.defaultCategoryId === categoryId
        ? categoryIds[0] || ""
        : current.defaultCategoryId;
      return {
        ...current,
        categoryIds,
        defaultCategoryId,
        images: checked
          ? current.images
          : current.images.filter((image) => image.categoryId !== categoryId),
      };
    });
  const chooseFiles = (
    categoryId: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length)
      setFiles((current) => ({
        ...current,
        [categoryId]: [...(current[categoryId] ?? []), ...selected],
      }));
    event.target.value = "";
  };
  const removeImage = (categoryId: string, index: number) =>
    setForm((current) => ({
      ...current,
      images: current.images.filter(
        (image, imageIndex) =>
          !(
            image.categoryId === categoryId &&
            current.images.filter(
              (entry, entryIndex) =>
                entryIndex < imageIndex && entry.categoryId === categoryId
            ).length === index
          )
      ),
    }));
  const removeNewFile = (categoryId: string, index: number) =>
    setFiles((current) => ({
      ...current,
      [categoryId]: (current[categoryId] ?? []).filter(
        (_, fileIndex) => fileIndex !== index
      ),
    }));
  const uploadFiles = async () => {
    const newImages: ProductImage[] = [];
    for (const [categoryId, categoryFiles] of Object.entries(files)) {
      if (!categoryFiles.length) continue;
      const payload = new FormData();
      categoryFiles.forEach((file) => payload.append("images", file));
      const response = await fetch("/api/admin/product-images", {
        method: "POST",
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Image upload failed.");
      newImages.push(
        ...data.images.map((image: Omit<ProductImage, "categoryId">) => ({
          ...image,
          categoryId,
        }))
      );
    }
    return newImages;
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const uploaded = await uploadFiles();
      const images = [...form.images, ...uploaded];
      if (
        form.categoryIds.some(
          (categoryId) =>
            !images.some((image) => image.categoryId === categoryId)
        )
      )
        throw new Error(
          "Upload at least one image for every selected category."
        );
      const response = await fetch(
        editing ? `/api/products/${editing.id}` : "/api/products",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, images }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setOpen(false);
      void load();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this product and its images?")) return;
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!response.ok) return setError((await response.json()).error);
    void load();
  };
  return (
    <div className="panel list-panel">
      <Button onClick={openCreate}>
        <FiPlus /> Add Product
      </Button>
      {error && <p className="form-error">{error}</p>}
      <div className="overflow-x-auto">
        <div className="min-w-[720px] divide-y divide-line">
          {products.length ? (
            products.map((product) => (
              <article
                key={product.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 py-4"
              >
                <div>
                  <H3>{product.name}</H3>
                  <p className="mt-1 text-sm text-black/60">
                    {product.categories
                      .map((item) => item.category.name)
                      .join(", ")}
                  </p>
                </div>
                <p className="text-sm">
                  ₹ {Number(product.price).toLocaleString("en-IN")}
                </p>
                <p className="text-sm">Default: {product.category.name}</p>
                <p className="text-sm">
                  <span className="bg-black/5 px-3 py-1">{product.status}</span>
                </p>
                <div className="item-actions">
                  <Button variant="unstyled" size="none"
                    aria-label={`Edit ${product.name}`}
                    onClick={() => openEdit(product)}
                  >
                    <FiEdit2 size={16} />
                  </Button>
                  <Button variant="unstyled" size="none"
                    aria-label={`Delete ${product.name}`}
                    onClick={() => void remove(product.id)}
                  >
                    <FiTrash2 color="red" size={16} />
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <div className="surface-message">No products found.</div>
          )}
        </div>
      </div>
      <Modal
        open={open}
        title={editing ? "Edit Product" : "Add Product"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={save} className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Product Design Name" required>
              <Input
                value={form.name}
                onChange={(event) => change("name", event.target.value)}
                required
              />
            </FormField>
            <FormField label="SKU">
              <Input
                value={form.sku}
                onChange={(event) => change("sku", event.target.value)}
              />
            </FormField>
            <FormField label="Price (₹)" required>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => change("price", event.target.value)}
                required
              />
            </FormField>
            <FormField label="Collection">
              <select
                className="w-full border border-gray-200 bg-white px-4 py-3"
                value={form.collectionId}
                onChange={(event) => change("collectionId", event.target.value)}
              >
                <option value="">No collection</option>
                {collections.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Status">
              <select
                className="w-full border border-gray-200 bg-white px-4 py-3"
                value={form.status}
                onChange={(event) =>
                  change("status", event.target.value as Product["status"])
                }
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </FormField>
          </div>
          <FormField label="Description">
            <Textarea
              rows={3}
              value={form.description}
              onChange={(event) => change("description", event.target.value)}
            />
          </FormField>
          <fieldset className="border border-line p-4">
            <legend className="px-1 text-sm font-medium">
              Categories <span className="text-danger">*</span>
            </legend>
            <p className="mb-3 text-sm text-black/60">
              Select one or more categories. The default category shows first on
              the storefront.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 border border-black/10 p-3"
                >
                  <input
                    type="checkbox"
                    checked={form.categoryIds.includes(category.id)}
                    onChange={(event) =>
                      setCategory(category.id, event.target.checked)
                    }
                  />
                  <span className="flex-1 text-sm font-medium">
                    {category.name}
                  </span>
                  {form.categoryIds.includes(category.id) && (
                    <span className="flex items-center gap-1 text-xs">
                      <input
                        type="radio"
                        name="default-category"
                        checked={form.defaultCategoryId === category.id}
                        onChange={() =>
                          change("defaultCategoryId", category.id)
                        }
                      />{" "}
                      Default
                    </span>
                  )}
                </label>
              ))}
            </div>
          </fieldset>
          {form.categoryIds.map((categoryId) => {
            const category = categories.find((item) => item.id === categoryId);
            const existing = form.images.filter(
              (image) => image.categoryId === categoryId
            );
            const pending = files[categoryId] ?? [];
            return (
              <section key={categoryId} className="border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{category?.name} images</h3>
                    <p className="text-sm text-black/60">
                      Upload images that represent this design in this category.
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-white">
                    <FiUpload /> Add images
                    <input
                      className="sr-only"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={(event) => chooseFiles(categoryId, event)}
                    />
                  </label>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {existing.map((image, index) => (
                    <div
                      key={`${image.url}-${index}`}
                      className="relative aspect-square overflow-hidden border"
                    >
                      <img
                        src={image.url}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />
                      <Button variant="unstyled" size="none"
                        type="button"
                        aria-label="Remove image"
                        onClick={() => removeImage(categoryId, index)}
                        className="absolute right-1 top-1 bg-white p-1 text-black shadow"
                      >
                        <FiX />
                      </Button>
                    </div>
                  ))}
                  {pending.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="relative aspect-square overflow-hidden border bg-black/5"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="New upload preview"
                        className="h-full w-full object-cover"
                      />
                      <Button variant="unstyled" size="none"
                        type="button"
                        aria-label="Remove image"
                        onClick={() => removeNewFile(categoryId, index)}
                        className="absolute right-1 top-1 bg-white p-1 text-black shadow"
                      >
                        <FiX />
                      </Button>
                    </div>
                  ))}
                </div>
                {!existing.length && !pending.length && (
                  <p className="mt-3 text-sm text-danger">
                    At least one image is required for this category.
                  </p>
                )}
              </section>
            );
          })}
          <Checkbox
            label="Feature this product on the home page"
            checked={form.isFeatured}
            onChange={(event) => change("isFeatured", event.target.checked)}
          />
          {error && <p className="form-error">{error}</p>}
          <div className="flex justify-end">
            <Button disabled={saving}>
              {saving
                ? "Uploading & saving..."
                : editing
                ? "Update Product"
                : "Create Product"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
