import { FaFacebookF, FaInstagram } from "react-icons/fa6";

const socialLinks = [
  { label: "Instagram", content: <FaInstagram size={19} /> },
  { label: "Facebook", content: <FaFacebookF size={17} /> },
];

export default function StorefrontFooter() {
  return (
    <footer className="px-3 sm:px-7">
      <div className="flex min-h-16 items-center justify-between gap-4 border-t border-black/10 py-4 text-sm text-black/55">
        <p>© 2026 Khatri Threads. All rights reserved.</p>
        <nav
          className="flex items-center gap-4 text-black/60"
          aria-label="Social links"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href="#"
              aria-label={link.label}
              className="grid h-5 w-5 place-items-center hover:text-primary"
            >
              {link.content}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
