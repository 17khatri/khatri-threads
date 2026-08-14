"use client";

import { FiBriefcase, FiDownload, FiMail, FiPhone, FiUser } from "react-icons/fi";
import Button from "@/app/components/button";
import { H2, H3, P } from "@/app/components/typography";
import { useUsers } from "@/app/hooks/use-users";
import { useAuthStore } from "@/store/auth-store";

function escapeCsvValue(value: string | null) {
  const normalizedValue = value ?? "";
  return `"${normalizedValue.replaceAll('"', '""')}"`;
}

export default function UsersPage() {
  const { users, loading } = useUsers();
  const user = useAuthStore((state) => state.user);

  function exportUsers() {
    const headings = ["Name", "Phone", "Email", "Office Name", "Address", "City", "Pincode"];
    const rows = users.map((exportUser) => [
      `${exportUser.firstName} ${exportUser.lastName}`.trim(),
      exportUser.phone,
      exportUser.email,
      exportUser.officeName,
      exportUser.address,
      exportUser.city,
      exportUser.pincode,
    ]);
    const csv = [headings, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\r\n");
    const file = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "khushi-enterprise-users.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (user && user.role !== "ADMIN") {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <P className="text-red-500 font-semibold">Access Denied. Admins only.</P>
      </div>
    );
  }


  return (
    <div className="w-full">
      <div className="panel list-panel">
        <div className="panel-heading">
          <div>
            <H2 className="mb-2">Users</H2>
            <P>Manage all registered users.</P>
          </div>
          <Button
            type="button"
            size="md"
            onClick={exportUsers}
            disabled={loading || users.length === 0}
          >
            <FiDownload size={17} aria-hidden="true" />
            Export to Excel
          </Button>
        </div>

        {loading && <div className="surface-message">Loading...</div>}

        {!loading && users.length === 0 && (
          <div className="surface-message">No users found.</div>
        )}

        <div className="space-y-4">
          {users.map((user) => (
            <article
              key={user.id}
              className="rounded-xl border border-line bg-panel p-5 transition hover:border-primary hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                  <FiUser className="text-primary" size={32} />
                </div>

                <div>
                  <H3>
                    {user.firstName} {user.lastName}
                  </H3>

                  <div className="mt-4 grid gap-2 text-sm text-muted">
                    <div className="flex items-center gap-2">
                      <FiMail size={16} />
                      {user.email}
                    </div>

                    <div className="flex items-center gap-2">
                      <FiPhone size={16} />
                      {user.phone}
                    </div>

                    <div className="flex items-center gap-2">
                      <FiBriefcase size={16} />
                      {user.officeName}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
