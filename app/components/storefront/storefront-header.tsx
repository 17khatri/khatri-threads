"use client";

import { FiEdit2, FiMenu, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import ROUTES from "@/helper/routes";
import { useAuth } from "@/app/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { Drawer } from "@/app/components/drawer";
import { FormField, Input } from "@/app/components/form-fields";
import Button from "@/app/components/button";
import type { AuthUser } from "@/types/auth";

type ProfileDraft = Pick<
  AuthUser,
  "firstName" | "lastName" | "email" | "phone"
> & {
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const toProfileDraft = (user: AuthUser): ProfileDraft => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  address: user.address || "",
  city: user.city || "",
  state: user.state || "",
  pincode: user.pincode || "",
});

export default function StorefrontHeader() {
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<AuthUser | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileDraft, setProfileDraft] = useState<ProfileDraft | null>(null);
  const closeTimer = useRef<number | null>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useAuth();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const navigateToCollections = () => {
    router.push(ROUTES.SHOP);
    closeMenu();
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    void fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;

        const data = (await response.json()) as { user?: AuthUser };
        if (!isCancelled && data.user) setUser(data.user);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!isCancelled) setIsAuthReady(true);
      });

    return () => {
      isCancelled = true;
    };
  }, [setUser]);

  useEffect(() => {
    if (!isProfileDrawerOpen) return;

    let isCancelled = false;
    void fetch("/api/auth/me", { credentials: "include" })
      .then(async (response) => {
        const data = (await response.json()) as { user?: AuthUser; error?: string };

        if (!response.ok || !data.user) {
          throw new Error(data.error || "Unable to load profile details.");
        }

        if (!isCancelled) {
          setProfileUser(data.user);
          setUser(data.user);
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setProfileError(
            error instanceof Error ? error.message : "Unable to load profile details.",
          );
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isProfileDrawerOpen, setUser]);

  useEffect(() => {
    const closeAccountMenu = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsAccountMenuOpen(false);
    };

    document.addEventListener("mousedown", closeAccountMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeAccountMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const openMenu = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setIsMenuMounted(true);
    window.requestAnimationFrame(() => setIsMenuVisible(true));
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
    closeTimer.current = window.setTimeout(() => setIsMenuMounted(false), 200);
  };

  const handleLogout = async () => {
    setIsAccountMenuOpen(false);
    await logout();
  };

  const openProfileDrawer = () => {
    setIsAccountMenuOpen(false);
    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }
    setProfileError("");
    setProfileUser(user);
    setIsProfileDrawerOpen(true);
  };

  const handleAccountClick = () => {
    if (!isAuthReady) return;

    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }

    setIsAccountMenuOpen((isOpen) => !isOpen);
  };

  const startEditingProfile = () => {
    const currentUser = profileUser || user;
    if (!currentUser) return;

    setProfileDraft(toProfileDraft(currentUser));
    setProfileError("");
    setIsEditingProfile(true);
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profileDraft) return;

    setIsSavingProfile(true);
    setProfileError("");

    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileDraft),
      });
      const data = (await response.json()) as { user?: AuthUser; error?: string };

      if (!response.ok || !data.user) {
        throw new Error(data.error || "Unable to update profile.");
      }

      setProfileUser(data.user);
      setUser(data.user);
      setIsEditingProfile(false);
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : "Unable to update profile.",
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <>
      <header className="relative flex items-center justify-between py-4 sm:py-5">
        <div className="hidden items-center gap-8 md:flex lg:gap-10">
          <Link
            href="/"
            className="text-base font-bold tracking-tight lg:text-lg text-primary"
          >
            Khatri Threads
          </Link>
          <nav className="flex items-center cursor-pointer gap-5 text-sm text-slate-700 lg:gap-6">
            <a onClick={navigateToCollections} className="hover:text-primary">
              Shop
            </a>
            <Link href={ROUTES.CUSTOMIZE} className="hover:text-primary">
              Customize
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-5 md:hidden">
          <Button variant="unstyled" size="none"
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuVisible}
            onClick={openMenu}
            className="hover:text-primary"
          >
            <FiMenu size={20} />
          </Button>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-base font-bold tracking-tight md:hidden text-primary"
        >
          Khatri Threads
        </Link>

        <div className="flex items-center gap-4 text-slate-900 sm:gap-6">
          <div ref={accountMenuRef} className="relative flex">
            <Button variant="unstyled" size="none"
              type="button"
              aria-label="Account"
              aria-expanded={user ? isAccountMenuOpen : undefined}
              aria-haspopup={user ? "menu" : undefined}
              aria-busy={!isAuthReady}
              onClick={handleAccountClick}
              className="cursor-pointer hover:text-primary"
            >
              <FiUser size={20} />
            </Button>

            {isAccountMenuOpen && (
              <div
                role="menu"
                aria-label="Account options"
                className="absolute right-0 top-full z-20 mt-3 w-40 rounded-none border border-slate-200 bg-white py-1 shadow-lg"
              >
                <Button variant="unstyled" size="none"
                  type="button"
                  role="menuitem"
                  onClick={openProfileDrawer}
                  className="block w-full cursor-pointer px-4 py-2 text-left text-sm hover:bg-slate-50 hover:text-primary"
                >
                  View profile
                </Button>
                <Button variant="unstyled" size="none"
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="block w-full cursor-pointer px-4 py-2 text-left text-sm hover:bg-slate-50 hover:text-primary"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
          <Button variant="unstyled" size="none"
            type="button"
            aria-label="Shopping bag, 1 item"
            className="relative hover:text-primary cursor-pointer"
          >
            <FiShoppingCart size={21} />
          </Button>
        </div>
      </header>

      <Drawer
        open={isProfileDrawerOpen}
        title="My profile"
        onClose={() => setIsProfileDrawerOpen(false)}
      >
        {profileUser || user ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-none bg-primary/10 text-xl font-semibold text-primary">
                {(profileUser || user)?.firstName[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">
                  {(profileUser || user)?.firstName} {(profileUser || user)?.lastName}
                </p>
              </div>
              {!isEditingProfile && (
                <Button variant="unstyled" size="none"
                  type="button"
                  onClick={startEditingProfile}
                  className="inline-flex items-center gap-2 rounded-none border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-primary hover:text-primary"
                >
                  <FiEdit2 size={16} />
                  Edit
                </Button>
              )}
            </div>

            {profileError && (
              <p className="rounded-none border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {profileError}
              </p>
            )}

            {isEditingProfile && profileDraft ? (
              <ProfileForm
                draft={profileDraft}
                isSaving={isSavingProfile}
                onCancel={() => setIsEditingProfile(false)}
                onChange={(field, value) =>
                  setProfileDraft((currentDraft) =>
                    currentDraft ? { ...currentDraft, [field]: value } : currentDraft,
                  )
                }
                onSubmit={saveProfile}
              />
            ) : (
              <dl className="divide-y divide-slate-100 rounded-none border border-slate-200">
                <ProfileDetail label="First name" value={(profileUser || user)?.firstName} />
                <ProfileDetail label="Last name" value={(profileUser || user)?.lastName} />
                <ProfileDetail label="Email" value={(profileUser || user)?.email} />
                <ProfileDetail label="Phone" value={(profileUser || user)?.phone} />
                <ProfileDetail label="Address" value={(profileUser || user)?.address} />
                <ProfileDetail label="City" value={(profileUser || user)?.city} />
                <ProfileDetail label="State" value={(profileUser || user)?.state} />
                <ProfileDetail label="Pincode" value={(profileUser || user)?.pincode} />
              </dl>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-600">No user details are available.</p>
        )}
      </Drawer>

      {isMenuMounted &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
            <Button variant="unstyled" size="none"
              type="button"
              aria-label="Close menu"
              className={`absolute inset-0 z-0 bg-black/30 transition-opacity duration-200 ${
                isMenuVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeMenu}
            />
            <aside
              className={`relative z-10 flex h-dvh w-[min(20rem,85vw)] flex-col bg-white px-6 py-5 shadow-xl transition-transform duration-200 ease-out ${
                isMenuVisible ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold tracking-tight">
                  Khatri Threads
                </span>
                <Button variant="unstyled" size="none"
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                >
                  <FiX size={22} />
                </Button>
              </div>
              <nav className="mt-12 flex flex-col  border-slate-100">
                <a
                  href="#collection"
                  onClick={navigateToCollections}
                  className="py-5 text-lg font-medium"
                >
                  Shop
                </a>
                <Link href={ROUTES.CUSTOMIZE} onClick={closeMenu} className="py-5 text-lg font-medium">
                  Customize
                </Link>
              </nav>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}

function ProfileDetail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-slate-900">{value || "—"}</dd>
    </div>
  );
}

function ProfileForm({
  draft,
  isSaving,
  onCancel,
  onChange,
  onSubmit,
}: {
  draft: ProfileDraft;
  isSaving: boolean;
  onCancel: () => void;
  onChange: (field: keyof ProfileDraft, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const fields: Array<{ field: keyof ProfileDraft; label: string; type?: string; maxLength?: number }> = [
    { field: "firstName", label: "First name" },
    { field: "lastName", label: "Last name" },
    { field: "email", label: "Email", type: "email" },
    { field: "phone", label: "Phone", type: "tel", maxLength: 10 },
    { field: "address", label: "Address" },
    { field: "city", label: "City" },
    { field: "state", label: "State" },
    { field: "pincode", label: "Pincode", maxLength: 6 },
  ];

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ field, label, type = "text", maxLength }) => (
          <FormField key={field} label={label} htmlFor={`profile-${field}`}>
            <Input
              id={`profile-${field}`}
              type={type}
              value={draft[field]}
              maxLength={maxLength}
              disabled={isSaving}
              onChange={(event) => onChange(field, event.target.value)}
            />
          </FormField>
        ))}
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="unstyled" size="none"
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-none px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </Button>
        <Button variant="unstyled" size="none"
          type="submit"
          disabled={isSaving}
          className="rounded-none bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
