/**
 * Schémas Schema.org pour Cabinet Martin M&A
 * Les champs marqués TODO sont à compléter une fois les infos disponibles.
 *
 * Ressources :
 *  - https://schema.org/
 *  - https://search.google.com/test/rich-results  (outil de test)
 *  - https://validator.schema.org/               (outil de validation)
 */

const SITE_URL   = "https://www.cabinetmartin-ma.fr"; // TODO : confirmer l'URL définitive
const LOGO_URL   = `${SITE_URL}/img/logo/logo-cabinet-martin-ma-512x512.png`;

// ─── Organisation de base (réutilisée dans plusieurs schémas) ─────────────────
const organizationBase = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: "Cabinet Martin M&A",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
    width: 512,
    height: 512,
  },
  image: LOGO_URL,
  description:
    "Cabinet de conseil spécialisé dans l'obtention de subventions et Certificats d'Économie d'Énergie (CEE). Accompagnement sur mesure pour TPE, PME, associations et collectivités. Paiement à la réussite.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3 rue de Pion",
    addressLocality: "Pontonx-sur-l'Adour",
    postalCode: "40465",
    addressRegion: "Landes",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "TODO : latitude GPS",   // TODO : à compléter depuis Google Maps
    longitude: "TODO : longitude GPS", // TODO : à compléter depuis Google Maps
  },
  telephone: "+33645653761",
  email: "contact@cabinetmartin-ma.fr",
  areaServed: {
    "@type": "Country",
    name: "France",
  },
  serviceArea: {
    "@type": "AdministrativeArea",
    name: "France entière",
  },
  openingHoursSpecification: [
    // TODO : à compléter avec les vrais horaires
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  founders: [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#mylene-martin`,
      name: "Mylène Martin",
      jobTitle: "Associée",
      email: "mylene@cabinetmartin-ma.fr",
      telephone: "+33624702462",
      image: `${SITE_URL}/img/team/mylene.jpg`,
      worksFor: { "@id": `${SITE_URL}/#organization` },
      sameAs: [
        "TODO : URL profil LinkedIn Mylène", // TODO
      ],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#alexandre-martin`,
      name: "Alexandre Martin",
      jobTitle: "Associé",
      email: "alexandre@cabinetmartin-ma.fr",
      telephone: "+33645653761",
      image: `${SITE_URL}/img/team/alexandre.jpg`,
      worksFor: { "@id": `${SITE_URL}/#organization` },
      sameAs: [
        "TODO : URL profil LinkedIn Alexandre", // TODO
      ],
    },
  ],
  sameAs: [
    "TODO : URL page Google Business",  // TODO : à ajouter après création Google Business
    "TODO : URL page LinkedIn entreprise", // TODO
    // "https://www.facebook.com/...",   // TODO si applicable
  ],
  // TODO : une fois Google Business créé, ajouter :
  // hasMap: "https://goo.gl/maps/...",
};

// ─── 1. Organization ──────────────────────────────────────────────────────────
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    ...organizationBase,
  };
}

// ─── 2. WebSite (avec SearchAction pour Sitelinks search box) ─────────────────
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Cabinet Martin M&A",
    description: "Expert en financement et subventions CEE — France entière",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "fr-FR",
  };
}

// ─── 3. LocalBusiness (homepage) ──────────────────────────────────────────────
export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@id": `${SITE_URL}/#localbusiness`,
    ...organizationBase,
    "@type": ["LocalBusiness", "ProfessionalService"],
    priceRange: "Sur devis — paiement à la réussite",
    currenciesAccepted: "EUR",
    paymentAccepted: "Paiement à la réussite",
    // TODO : ajouter après création Google Business :
    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: "5",
    //   reviewCount: "TODO",
    //   bestRating: "5",
    //   worstRating: "1",
    // },
  };
}

// ─── 4. FAQPage ───────────────────────────────────────────────────────────────
export function buildFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quels types de financements pouvez-vous m'aider à obtenir ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nous vous accompagnons sur l'ensemble des dispositifs de financement public et privé : subventions européennes, nationales et régionales, certificats d'économie d'énergie (CEE), crédits d'impôt, prêts bonifiés, et financements de fondations. Notre expertise couvre tous les secteurs d'activité.",
        },
      },
      {
        "@type": "Question",
        name: "Combien coûtent vos services ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Notre modèle est basé sur le succès : vous ne payez que si votre dossier aboutit. Nos honoraires sont calculés en pourcentage du montant obtenu, selon des conditions définies en amont. Pas de frais cachés, pas de mauvaise surprise.",
        },
      },
      {
        "@type": "Question",
        name: "Combien de temps prend le processus de demande de financement ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Les délais varient selon le type de financement (de 2 à 12 mois en moyenne). Nous vous accompagnons à chaque étape pour optimiser les chances de succès et respecter les échéances imposées par les organismes financeurs.",
        },
      },
      {
        "@type": "Question",
        name: "Dois-je être une grande entreprise pour bénéficier de vos services ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolument pas ! Nous accompagnons aussi bien les TPE/PME que les grandes entreprises, les associations, les collectivités et les porteurs de projets. Chaque projet mérite un financement adapté, quelle que soit sa taille.",
        },
      },
      {
        "@type": "Question",
        name: "Garantissez-vous l'obtention du financement ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nous maximisons vos chances de succès grâce à notre expertise et notre connaissance approfondie des dispositifs, mais nous ne pouvons garantir à 100% l'obtention. Les décisions finales appartiennent aux organismes financeurs. Notre taux de réussite est cependant très élevé.",
        },
      },
      {
        "@type": "Question",
        name: "Puis-je gérer mon dossier seul après votre intervention ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, tout à fait. Nous vous formons et vous transférons toutes les compétences nécessaires pour gérer vos futurs dossiers en autonomie si vous le souhaitez. Nous restons également disponibles pour un accompagnement ponctuel.",
        },
      },
    ],
  };
}

// ─── 5. BreadcrumbList ────────────────────────────────────────────────────────
export function buildBreadcrumbSchema(
  crumbs: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.href}`,
    })),
  };
}

// ─── 6. WebPage générique ─────────────────────────────────────────────────────
export function buildWebPageSchema({
  title,
  description,
  path,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}${path}#webpage`,
    url: `${SITE_URL}${path}`,
    name: title,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "fr-FR",
    ...(dateModified ? { dateModified } : {}),
  };
}
