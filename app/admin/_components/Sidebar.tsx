"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { TiDocument, TiStar, TiGroup, TiFolder, TiPower, TiHome, TiMessages, TiImage } from "react-icons/ti";

const NAV = [
  { href: "/admin/blog",        label: "Blog",          icon: TiDocument  },
  { href: "/admin/references",  label: "Références",    icon: TiStar      },
  { href: "/admin/members",     label: "Membres",       icon: TiGroup     },
  { href: "/admin/avis",        label: "Avis",          icon: TiMessages  },
  { href: "/admin/ressources",  label: "Ressources",    icon: TiFolder    },
  { href: "/admin/medias",      label: "Médiathèque",   icon: TiImage     },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 flex flex-col h-full" style={{ background: "#1b2a47" }}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-white font-semibold text-sm tracking-wide">Cabinet Martin</span>
        <p className="text-white/40 text-xs mt-0.5">Administration</p>
      </div>

      {/* Accéder au site */}
      <div className="px-3 pt-3 pb-2 border-b border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-all duration-150"
        >
          <TiHome className="text-base shrink-0" />
          Accéder au site
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[#ae894a] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/8",
              ].join(" ")}
            >
              <Icon className="text-base shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: `${window.location.origin}/admin/login` })}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-all duration-150"
        >
          <TiPower className="text-base shrink-0" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
