import { useEffect, useState } from "react";

export type Category = {
  id: string;
  name: string;
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    setLoading(true);

    const response = await fetch("/api/categories", {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function createCategory(name: string) {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    await loadCategories();
  }

  async function updateCategory(id: string, name: string) {
    const response = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    await loadCategories();
  }

  async function deleteCategory(id: string) {
    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    await loadCategories();
  }

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
