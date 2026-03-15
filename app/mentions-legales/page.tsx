"use client";

import CustomTitle from "../components/ui/CustomTitle/CustomTitle";
import { useIsDark } from "../hooks/useIsDark";

// ─── Tokens light / dark ─────────────────────────────────────────────────────
function useTokens() {
  const isDark = useIsDark();

  return {
    isDark,
    sectionBg:  isDark ? "var(--overlay)"         : "var(--bg)",
    text:       isDark ? "var(--overlayText)"      : "var(--text)",
    muted:      isDark ? "rgba(249,245,236,0.65)"  : "rgba(27,42,71,0.65)",
    heading:    isDark ? "rgba(249,245,236,0.92)"  : "var(--text)",
    divider:    isDark ? "rgba(249,245,236,0.1)"   : "rgba(27,42,71,0.1)",
    titleClass: isDark ? "text-(--overlayText)"    : "text-(--text)",
  };
}

// ─── Composants locaux ────────────────────────────────────────────────────────
function Section({
  title,
  children,
  t,
}: {
  title: string;
  children: React.ReactNode;
  t: ReturnType<typeof useTokens>;
}) {
  return (
    <div
      className="pt-10 border-t"
      style={{ borderColor: t.divider }}
    >
      <h2
        className="text-lg font-semibold tracking-[-0.01em] mb-4"
        style={{ color: t.heading }}
      >
        {title}
      </h2>
      <div
        className="text-sm leading-relaxed space-y-2"
        style={{ color: t.muted }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MentionsLegales() {
  const t = useTokens();

  return (
    <section
      className="min-h-screen transition-colors duration-500"
      style={{ background: t.sectionBg }}
    >
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:px-8 md:py-20">
        <CustomTitle title="Mentions légales" offset={30} className={t.titleClass} />

        <p className="mt-4 text-sm leading-relaxed" style={{ color: t.muted }}>
          Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004
          pour la confiance en l&apos;économie numérique, il est précisé aux
          utilisateurs du site l&apos;identité des différents intervenants dans
          le cadre de sa réalisation et de son suivi.
        </p>

        <div className="mt-10 space-y-10">

          {/* 1. Éditeur */}
          <Section title="1. Éditeur du site" t={t}>
            <p>
              <strong style={{ color: t.heading }}>Cabinet Martin M&amp;A</strong>
            </p>
            <p>Forme juridique : SARL</p>
            <p>Capital social : [Information à compléter] €</p>
            <p>Siège social : 3 rue de Pion, 40465 Pontonx-sur-l&apos;Adour, France</p>
            <p>SIRET : [Information à compléter]</p>
            <p>RCS : [Information à compléter]</p>
            <p>N° TVA intracommunautaire : [Information à compléter]</p>
            <p>
              Directeur de la publication : Mylène Martin &amp; Alexandre Martin
            </p>
            <p>
              Email :{" "}
              <a
                href="mailto:contact@cabinetmartin-ma.fr"
                className="hover:text-(--color-brand-100) transition-colors"
                style={{ color: t.heading }}
              >
                contact@cabinetmartin-ma.fr
              </a>
            </p>
            <p>
              Téléphone :{" "}
              <a
                href="tel:+33645653761"
                className="hover:text-(--color-brand-100) transition-colors"
                style={{ color: t.heading }}
              >
                06 45 65 37 61
              </a>{" "}
              /{" "}
              <a
                href="tel:+33624702462"
                className="hover:text-(--color-brand-100) transition-colors"
                style={{ color: t.heading }}
              >
                06 24 70 24 62
              </a>
            </p>
          </Section>

          {/* 2. Hébergement */}
          <Section title="2. Hébergement" t={t}>
            <p>Le site est hébergé par :</p>
            <p>
              <strong style={{ color: t.heading }}>[Information à compléter — nom de l&apos;hébergeur]</strong>
            </p>
            <p>[Information à compléter — adresse de l&apos;hébergeur]</p>
            <p>[Information à compléter — site web de l&apos;hébergeur]</p>
          </Section>

          {/* 3. Conception & développement */}
          <Section title="3. Conception et développement" t={t}>
            <p>
              Le site a été conçu et développé par{" "}
              <a
                href="https://www.nemosolutions.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-(--color-brand-100) transition-colors"
                style={{ color: t.heading }}
              >
                NemoSolutions
              </a>
              .
            </p>
          </Section>

          {/* 4. Propriété intellectuelle */}
          <Section title="4. Propriété intellectuelle" t={t}>
            <p>
              L&apos;ensemble de ce site relève de la législation française et
              internationale sur le droit d&apos;auteur et la propriété
              intellectuelle. Tous les droits de reproduction sont réservés, y
              compris pour les documents téléchargeables et les représentations
              iconographiques et photographiques.
            </p>
            <p>
              La reproduction de tout ou partie de ce site sur quelque support
              que ce soit est formellement interdite sauf autorisation expresse
              du directeur de la publication.
            </p>
          </Section>

          {/* 5. Données personnelles */}
          <Section title="5. Données personnelles" t={t}>
            <p>
              Conformément au Règlement Général sur la Protection des Données
              (RGPD) n° 2016/679 du 27 avril 2016 et à la loi Informatique et
              Libertés n° 78-17 du 6 janvier 1978 modifiée, vous disposez d&apos;un
              droit d&apos;accès, de rectification, d&apos;effacement, de portabilité et
              d&apos;opposition concernant vos données personnelles.
            </p>
            <p>
              Pour exercer ces droits ou pour toute question relative au
              traitement de vos données, vous pouvez contacter :{" "}
              <a
                href="mailto:contact@cabinetmartin-ma.fr"
                className="hover:text-(--color-brand-100) transition-colors"
                style={{ color: t.heading }}
              >
                contact@cabinetmartin-ma.fr
              </a>
            </p>
            <p>
              Pour plus d&apos;informations sur notre traitement des données, veuillez
              consulter notre{" "}
              <a
                href="/confidentialite"
                className="hover:text-(--color-brand-100) transition-colors"
                style={{ color: t.heading }}
              >
                politique de confidentialité
              </a>
              .
            </p>
          </Section>

          {/* 6. Cookies */}
          <Section title="6. Cookies" t={t}>
            <p>
              Le site peut être amené à vous demander l&apos;acceptation des cookies
              pour des besoins de statistiques et d&apos;affichage. Un cookie est une
              information déposée sur votre disque dur par le serveur du site que
              vous visitez.
            </p>
            <p>
              Vous pouvez vous opposer à l&apos;enregistrement de cookies en
              configurant votre navigateur. Pour plus d&apos;informations, consultez
              notre{" "}
              <a
                href="/cookies"
                className="hover:text-(--color-brand-100) transition-colors"
                style={{ color: t.heading }}
              >
                politique de cookies
              </a>
              .
            </p>
          </Section>

          {/* 7. Liens hypertextes */}
          <Section title="7. Liens hypertextes" t={t}>
            <p>
              Le site peut contenir des liens hypertextes vers d&apos;autres sites
              internet. Cabinet Martin M&amp;A ne peut être tenu responsable du
              contenu de ces sites tiers ni des éventuels dommages résultant de
              leur utilisation.
            </p>
            <p>
              Toute création de lien vers le présent site est soumise à
              l&apos;accord préalable du directeur de la publication.
            </p>
          </Section>

          {/* 8. Responsabilité */}
          <Section title="8. Limitation de responsabilité" t={t}>
            <p>
              Cabinet Martin M&amp;A met tout en œuvre pour offrir aux
              utilisateurs des informations et/ou outils disponibles et vérifiés,
              mais ne saurait être tenu pour responsable des erreurs, d&apos;une
              absence de disponibilité des informations et/ou de la présence de
              virus sur son site.
            </p>
            <p>
              Les informations communiquées sont présentées à titre indicatif et
              général sans valeur contractuelle. Malgré des mises à jour
              régulières, Cabinet Martin M&amp;A ne peut être tenu responsable
              de la modification des dispositions administratives et juridiques
              survenant après la publication.
            </p>
          </Section>

          {/* 9. Droit applicable */}
          <Section title="9. Droit applicable et juridiction compétente" t={t}>
            <p>
              Les présentes mentions légales sont soumises au droit français.
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </Section>

          <p className="pt-6 text-xs" style={{ color: t.muted }}>
            Dernière mise à jour : mars 2025
          </p>

        </div>
      </div>
    </section>
  );
}
