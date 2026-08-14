"use client";

import { useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { Modal } from "@/app/components/modal";
import { FormField, Input } from "@/app/components/form-fields";
import { useCategories } from "@/app/hooks/use-categories";
import { DeleteModal } from "@/app/components/DeleteModal";
import Button from "@/app/components/button";
import { H2, H3, P } from "@/app/components/typography";
import { useAuthStore } from "@/store/auth-store";

type Category = {
  id: string;
  name: string;
};

export default function CategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();
  const user = useAuthStore((state) => state.user);

  if (user && user.role !== "ADMIN") {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <P className="text-red-500 font-semibold">Access Denied. Admins only.</P>
      </div>
    );
  }


  function openCreateModal() {
    setEditingCategory(null);
    setName("");
    setError("");
    setShowModal(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingCategory) {
        await updateCategory(editingCategory.id, name);
      } else {
        await createCategory(name);
      }

      setShowModal(false);
      setEditingCategory(null);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedCategory) return;

    try {
      setDeleting(true);

      await deleteCategory(selectedCategory.id);

      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-full">
      <Modal
        open={showModal}
        title={editingCategory ? "Edit Category" : "Add Category"}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label="Category Name" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </FormField>

          {error && <p className="form-error">{error}</p>}

          <div className="flex justify-end">
            <Button variant="primary" disabled={saving}>
              {saving ? "Saving..." : editingCategory ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteModal
        open={showDeleteModal}
        loading={deleting}
        name={selectedCategory?.name || ""}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDelete}
      />

      <div className="panel list-panel">
        <div className="panel-heading">
          <div>
            <H2 className="mb-2">Categories</H2>
            <P>Manage product categories.</P>
          </div>

          <Button onClick={openCreateModal}>
            <FiPlus /> Add Category
          </Button>
        </div>

        {loading && <div className="surface-message">Loading...</div>}

        {!loading && categories.length === 0 && (
          <div className="surface-message">No categories found.</div>
        )}

        <div className="category-list">
          {categories.map((category) => (
            <article
              key={category.id}
              className="flex items-center gap-4 justify-between border border-line rounded-lg p-4"
            >
              <H3 className="font-medium">{category.name}</H3>

              <div className="item-actions shrink-0">
                <button onClick={() => openEditModal(category)}>
                  <FiEdit2 className="cursor-pointer" size={16} />
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowDeleteModal(true);
                  }}
                >
                  <FiTrash2 className="cursor-pointer" color="red" size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
