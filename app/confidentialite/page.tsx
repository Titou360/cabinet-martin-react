"use client";

import CustomTitle from "../components/ui/CustomTitle/CustomTitle";
import { useIsDark } from "../hooks/useIsDark";

function useTokens() {
  const isDark = useIsDark();
  return {
    isDark,
    bg:         isDark ? "var(--overlay)"         : "var(--bg)",
    text:       isDark ? "var(--overlayText)"      : "var(--text)",
    muted:      isDark ? "rgba(249,245,236,0.65)"  : "rgba(27,42,71,0.65)",
    heading:    isDark ? "rgba(249,245,236,0.92)"  : "var(--text)",
    divider:    isDark ? "rgba(249,245,236,0.1)"   : "rgba(27,42,71,0.1)",
    titleClass: isDark ? "text-(--overlayText)"    : "text-(--text)",
  };
}

function Section({ title, children, t }: { title: string; children: React.ReactNode; t: ReturnType<typeof useTokens> }) {
  return (
    <div className="pt-10 border-t" style={{ borderColor: t.divider }}>
      <h2 className="text-lg font-semibold tracking-[-0.01em] mb-4" style={{ color: t.heading }}>
        {title}
      </h2>
      <div className="text-sm leading-relaxed space-y-3" style={{ color: t.muted }}>
        {children}
      </div>
    </div>
  );
}

export default function Confidentialite() {
  const t = useTokens();

  return (
    <section className="min-h-screen transition-colors duration-500" style={{ background: t.bg }}>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:px-8 md:py-20">
        <CustomTitle title="Politique de confidentialité" offset={30} className={t.titleClass} />

        <p className="mt-4 text-sm leading-relaxed" style={{ color: t.muted }}>
          Cabinet Martin M&amp;A accorde une importance primordiale à la
          protection de vos données personnelles. La présente politique décrit
          comment nous collectons, utilisons et protégeons vos informations
          conformément au Règlement Général sur la Protection des Données
          (RGPD) n° 2016/679 et à la loi Informatique et Libertés n° 78-17
          du 6 janvier 1978 modifiée.
        </p>

        <div className="mt-10 space-y-10">

          <Section title="1. Responsable du traitement" t={t}>
            <p><strong style={{ color: t.heading }}>Cabinet Martin M&amp;A</strong></p>
            <p>3 rue de Pion, 40465 Pontonx-sur-l&apos;Adour, France</p>
            <p>
              Email :{" "}
              <a href="mailto:contact@cabinetmartin-ma.fr" className="hover:text-(--color-brand-100) transition-colors" style={{ color: t.heading }}>
                contact@cabinetmartin-ma.fr
              </a>
            </p>
          </Section>

          <Section title="2. Données collectées et finalités" t={t}>
            <p>Nous collectons vos données dans les situations suivantes :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong style={{ color: t.heading }}>Formulaire de contact</strong> — nom, prénom, email, téléphone, message.
                Finalité : répondre à votre demande. Base légale : intérêt légitime.
              </li>
              <li>
                <strong style={{ color: t.heading }}>Prise de rendez-vous</strong> — nom, email, créneau souhaité (via Cal.com).
                Finalité : organiser un entretien. Base légale : exécution du contrat.
              </li>
              <li>
                <strong style={{ color: t.heading }}>Navigation sur le site</strong> — données de navigation (cookies analytiques, si consentement donné).
                Finalité : améliorer le site. Base légale : consentement.
              </li>
            </ul>
          </Section>

          <Section title="3. Durée de conservation" t={t}>
            <p>
              Vos données sont conservées le temps nécessaire à la finalité pour
              laquelle elles ont été collectées, dans le respect des obligations
              légales :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Données de contact : 3 ans à compter du dernier contact.</li>
              <li>Données clients : 5 ans (obligations comptables et fiscales).</li>
              <li>Données de navigation : 13 mois maximum.</li>
            </ul>
          </Section>

          <Section title="4. Destinataires des données" t={t}>
            <p>
              Vos données ne sont pas vendues ni cédées à des tiers. Elles
              peuvent être transmises à nos sous-traitants techniques dans le
              strict cadre de la fourniture de leurs services :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong style={{ color: t.heading }}>EmailJS</strong> — envoi des formulaires de contact.</li>
              <li><strong style={{ color: t.heading }}>Cal.com</strong> — gestion des rendez-vous en ligne.</li>
              <li><strong style={{ color: t.heading }}>Google Analytics</strong> — mesure d&apos;audience (si consentement donné).</li>
              <li><strong style={{ color: t.heading }}>Hébergeur</strong> — [Information à compléter].</li>
            </ul>
            <p className="mt-3">
              Tous nos sous-traitants ont été sélectionnés pour leur conformité
              RGPD et sont liés par un accord de traitement des données.
            </p>
          </Section>

          <Section title="5. Transferts hors UE" t={t}>
            <p>
              Certains sous-traitants (Google, Cal.com) peuvent transférer des
              données vers des pays tiers. Ces transferts sont encadrés par les
              Clauses Contractuelles Types (CCT) de la Commission européenne ou
              par le Data Privacy Framework UE-États-Unis, garantissant un
              niveau de protection adéquat.
            </p>
          </Section>

          <Section title="6. Vos droits" t={t}>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong style={{ color: t.heading }}>Droit d&apos;accès</strong> — obtenir une copie de vos données.</li>
              <li><strong style={{ color: t.heading }}>Droit de rectification</strong> — corriger des données inexactes.</li>
              <li><strong style={{ color: t.heading }}>Droit à l&apos;effacement</strong> — demander la suppression de vos données.</li>
              <li><strong style={{ color: t.heading }}>Droit à la portabilité</strong> — recevoir vos données dans un format structuré.</li>
              <li><strong style={{ color: t.heading }}>Droit d&apos;opposition</strong> — vous opposer au traitement fondé sur l&apos;intérêt légitime.</li>
              <li><strong style={{ color: t.heading }}>Droit de retrait du consentement</strong> — à tout moment pour les traitements basés sur votre consentement.</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact@cabinetmartin-ma.fr" className="hover:text-(--color-brand-100) transition-colors" style={{ color: t.heading }}>
                contact@cabinetmartin-ma.fr
              </a>
              . Vous avez également le droit d&apos;introduire une réclamation auprès
              de la{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="hover:text-(--color-brand-100) transition-colors" style={{ color: t.heading }}>
                CNIL
              </a>
              .
            </p>
          </Section>

          <Section title="7. Sécurité" t={t}>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données contre tout accès non
              autorisé, toute perte ou altération : chiffrement HTTPS,
              accès restreint aux données, mises à jour régulières des systèmes.
            </p>
          </Section>

          <Section title="8. Cookies" t={t}>
            <p>
              Pour plus d&apos;informations sur les cookies utilisés par ce site,
              consultez notre{" "}
              <a href="/cookies" className="hover:text-(--color-brand-100) transition-colors" style={{ color: t.heading }}>
                politique de cookies
              </a>
              .
            </p>
          </Section>

          <Section title="9. Modifications" t={t}>
            <p>
              Nous nous réservons le droit de modifier cette politique de
              confidentialité. En cas de modification substantielle, nous vous
              en informerons par une notification visible sur le site.
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
