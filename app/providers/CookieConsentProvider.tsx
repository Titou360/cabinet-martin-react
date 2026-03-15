"use client";

import { useEffect } from "react";
import { run } from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";

export default function CookieConsentProvider() {
  useEffect(() => {
    run({
      // Délai avant affichage (ms)
      disablePageInteraction: false,

      guiOptions: {
        consentModal: {
          layout: "box inline",
          position: "bottom right",
          equalWeightButtons: false,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          position: "right",
          equalWeightButtons: false,
          flipButtons: false,
        },
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          autoClear: {
            cookies: [
              { name: /^_ga/ },
              { name: "_gid" },
              { name: "_gat" },
            ],
          },
        },
        marketing: {
          autoClear: {
            cookies: [{ name: /^_fbp/ }],
          },
        },
      },

      language: {
        default: "fr",
        translations: {
          fr: {
            consentModal: {
              title: "Nous utilisons des cookies",
              description:
                "Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et personnaliser notre contenu. Vous pouvez accepter tout ou gérer vos préférences.",
              acceptAllBtn: "Tout accepter",
              acceptNecessaryBtn: "Refuser",
              showPreferencesBtn: "Personnaliser",
              footer: `<a href="/mentions-legales">Mentions légales</a> · <a href="/confidentialite">Confidentialité</a> · <a href="/cookies">Cookies</a>`,
            },
            preferencesModal: {
              title: "Préférences de cookies",
              acceptAllBtn: "Tout accepter",
              acceptNecessaryBtn: "Tout refuser",
              savePreferencesBtn: "Sauvegarder mes préférences",
              closeIconLabel: "Fermer",
              serviceCounterLabel: "Service|Services",
              sections: [
                {
                  title: "Utilisation des cookies",
                  description:
                    "Cabinet Martin M&A utilise des cookies et des technologies similaires pour faire fonctionner le site, analyser son utilisation et vous proposer une expérience personnalisée. Vous pouvez choisir les catégories que vous acceptez ci-dessous.",
                },
                {
                  title: "Cookies strictement nécessaires",
                  description:
                    "Ces cookies sont indispensables au bon fonctionnement du site. Ils ne peuvent pas être désactivés car ils assurent les fonctionnalités essentielles (navigation, sécurité, mémorisation de vos préférences cookies).",
                  linkedCategory: "necessary",
                  cookieTable: {
                    headers: { name: "Nom", domain: "Domaine", desc: "Description" },
                    body: [
                      { name: "cc_cookie", domain: "cabinetmartin-ma.fr", desc: "Sauvegarde vos préférences de consentement aux cookies." },
                    ],
                  },
                },
                {
                  title: "Cookies analytiques",
                  description:
                    "Ces cookies nous permettent de mesurer l'audience du site (pages visitées, temps passé, parcours) afin d'améliorer nos contenus et l'expérience utilisateur. Les données collectées sont anonymisées.",
                  linkedCategory: "analytics",
                  cookieTable: {
                    headers: { name: "Nom", domain: "Domaine", desc: "Description" },
                    body: [
                      { name: "_ga", domain: ".google.com", desc: "Utilisé par Google Analytics pour distinguer les utilisateurs. Expire après 2 ans." },
                      { name: "_gid", domain: ".google.com", desc: "Utilisé par Google Analytics pour distinguer les utilisateurs. Expire après 24h." },
                    ],
                  },
                },
                {
                  title: "Cookies marketing",
                  description:
                    "Ces cookies sont utilisés pour vous proposer des publicités pertinentes et suivre l'efficacité de nos campagnes. Ils peuvent être déposés par des partenaires tiers.",
                  linkedCategory: "marketing",
                },
                {
                  title: "Plus d'informations",
                  description:
                    "Pour toute question relative à notre politique de cookies, contactez-nous à <a href=\"mailto:contact@cabinetmartin-ma.fr\">contact@cabinetmartin-ma.fr</a>.",
                },
              ],
            },
          },
        },
      },
    });
  }, []);

  return null;
}
