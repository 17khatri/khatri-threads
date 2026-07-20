import { useEffect, useState } from "react";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  officeName: string;
  address: string | null;
  city: string | null;
  pincode: string | null;
};

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);

    const response = await fetch("/api/users", {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return { users, loading };
}
