import StorefrontHeader from "@/app/components/storefront/storefront-header";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="wide-shell mx-auto">
          <StorefrontHeader />
        </div>
      </div>
      {children}
    </>
  );
}
