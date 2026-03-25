"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { TiLink } from "react-icons/ti";
import { FaLinkedin, FaGoogle, FaFacebook, FaQuoteLeft } from "react-icons/fa";
import { SiTrustpilot } from "react-icons/si";
import CustomTitle from "../ui/CustomTitle/CustomTitle";

interface Review {
  id: string;
  photo?: string | null;
  firstName: string;
  lastName: string;
  content: string;
  linkUrl?: string | null;
  realisationTitle?: string | null;
  realisationMonth?: string | null;
  realisationYear?: string | null;
}

function detectLinkType(url: string) {
  const u = url.toLowerCase();
  if (u.includes("linkedin.com"))                                    return "linkedin";
  if (u.includes("google.com") || u.includes("g.co") || u.includes("maps.app")) return "google";
  if (u.includes("trustpilot.com"))                                  return "trustpilot";
  if (u.includes("facebook.com") || u.includes("fb.com"))            return "facebook";
  return "other";
}

function LinkIcon({ url }: { url: string }) {
  const t = detectLinkType(url);
  if (t === "linkedin")   return <FaLinkedin   className="text-[#0A66C2] text-lg" />;
  if (t === "google")     return <FaGoogle     className="text-[#4285F4] text-lg" />;
  if (t === "trustpilot") return <SiTrustpilot className="text-[#00B67A] text-lg" />;
  if (t === "facebook")   return <FaFacebook   className="text-[#1877F2] text-lg" />;
  return                         <TiLink       className="text-[#ae894a] text-lg" />;
}

function ReviewAvatar({ review }: { review: Review }) {
  const [imgError, setImgError] = useState(false);
  if (review.photo && !imgError) {
    return (
      <Image
        src={review.photo}
        alt={review.firstName}
        width={40} height={40}
        className="rounded-full object-cover shrink-0"
        style={{ width: 40, height: 40 }}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-[#1b2a47]/10 shrink-0 flex items-center justify-center text-[#1b2a47]/40 text-sm font-semibold">
      {review.firstName[0]}{review.lastName[0]}
    </div>
  );
}

export default function Testimoniales() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/avis")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setReviews(data); })
      .catch(() => {});
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 md:py-20" style={{ background: "#f9f5ec" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <CustomTitle title="Ce que disent nos clients" offset={30} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map(review => (
            <div
              key={review.id}
              className="flex flex-col bg-white rounded-2xl p-6 border border-[#1b2a47]/6 shadow-sm"
            >
              {/* Guillemet décoratif */}
              <FaQuoteLeft className="text-[#ae894a]/25 text-3xl mb-4 shrink-0" />

              {/* Contenu */}
              <p className="text-sm leading-relaxed text-[#1b2a47]/70 flex-1 line-clamp-5">
                {review.content}
              </p>

              {/* Réalisation */}
              {(review.realisationTitle || review.realisationMonth || review.realisationYear) && (
                <p className="mt-3 text-xs font-medium italic" style={{ color: "#ae894a" }}>
                  {[
                    review.realisationTitle,
                    [review.realisationMonth, review.realisationYear].filter(Boolean).join("\u00a0"),
                  ].filter(Boolean).join(" · ")}
                </p>
              )}

              {/* Séparateur + auteur */}
              <div className="border-t border-[#1b2a47]/8 mt-4 pt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ReviewAvatar review={review} />
                  <p className="text-sm font-semibold text-[#1b2a47] truncate">
                    {review.firstName} {review.lastName}
                  </p>
                </div>

                {review.linkUrl && (
                  <a
                    href={review.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 opacity-70 hover:opacity-100 transition"
                  >
                    <LinkIcon url={review.linkUrl} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
