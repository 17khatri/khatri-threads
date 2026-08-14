import Link from "next/link";
import { FiFolder, FiPackage, FiTag } from "react-icons/fi";
import ROUTES from "@/helper/routes";

const links = [
  { href: ROUTES.PRODUCTS, label: "Products", description: "Add and manage your product catalogue.", icon: FiPackage },
  { href: ROUTES.CATEGORIES, label: "Categories", description: "Manage product categories.", icon: FiTag },
  { href: ROUTES.ADMIN_COLLECTIONS, label: "Collections", description: "Manage optional product collections.", icon: FiFolder },
];

export default function AdminDashboardPage() {
  return (
    <div className="panel p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-strong">Administration</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight">Manage your catalogue</h2>
      <p className="mt-2 text-black/60">Create and organize the products displayed in your store.</p>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {links.map(({ href, label, description, icon: Icon }) => (
          <Link key={href} href={href} className="rounded-xl border border-line p-5 transition hover:border-primary hover:bg-primary/5">
            <Icon className="text-primary-strong" size={22} />
            <h3 className="mt-4 font-semibold">{label}</h3>
            <p className="mt-1 text-sm leading-5 text-black/60">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
