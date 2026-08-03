import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa6";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/khatrithreads/",
    content: <FaInstagram size={19} />,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/918347407099",
    content: <FaWhatsapp size={19} />,
  },
  { label: "Facebook", content: <FaFacebook size={19} /> },
];

export default function StorefrontFooter() {
  return (
    <footer className="px-3 mt-12 sm:px-7">
      <div className="flex min-h-16 items-center justify-between gap-4 border-t border-black/10 py-4 text-sm text-black/55">
        <p>© 2026 Khatri Threads. All rights reserved.</p>
        <nav
          className="flex items-center gap-2 text-black/60"
          aria-label="Social links"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href ?? "#"}
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
