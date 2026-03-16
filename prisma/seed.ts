import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database…");

  // ── Admin user ──────────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL ?? "admin@cabinetmartin.fr";
  const rawPassword = "admin123";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  await prisma.adminUser.upsert({
    where:  { email },
    update: {},
    create: { email, passwordHash },
  });
  console.log(`  ✓ Admin user: ${email}`);

  // ── Article AIPAC ───────────────────────────────────────────────────────────
  const aipacContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Se déplacer pour aller en formation, pour passer un entretien, pour prendre son poste — ce qui semble évident pour beaucoup représente, pour de nombreux demandeurs d'emploi, un obstacle concret et quotidien. La mobilité est l'un des premiers freins à l'insertion professionnelle, et l' " },
          { type: "text", marks: [{ type: "link", attrs: { href: "#", target: "_blank" } }], text: "AIPAC — AIPAC Mobility" },
          { type: "text", text: " l'a parfaitement identifié." },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Un projet ambitieux, un financement à construire" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "L'association souhaitait doter ses salariés en insertion de vélos cargo : un outil de mobilité durable, accessible, et qui redonne de l'autonomie. 13 vélos au total — pour 13 personnes qui, demain, pourront se rendre au travail par leurs propres moyens." }],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Mais financer ce type de projet ne s'improvise pas. C'est là qu'intervient le mécanisme des " },
          { type: "text", marks: [{ type: "bold" }], text: "Certificats d'Économie d'Énergie (CEE)" },
          { type: "text", text: " : un dispositif réglementaire qui oblige les fournisseurs d'énergie à financer des actions de transition écologique et sociale. Bien monté, il permet d'obtenir une subvention significative sans avance de trésorerie." },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Le rôle du Cabinet Martin" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Mylène Martin a accompagné l'AIPAC de A à Z : audit d'éligibilité, structuration du dossier, coordination avec les partenaires énergéticiens, et suivi jusqu'au versement effectif. Un travail de fond, invisible pour l'extérieur, mais déterminant pour que le projet aboutisse." }],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "« Merci au Cabinet Martin, par l'intermédiaire de Mylène Martin, pour son engagement toujours sans faille au service de l'insertion et de l'accompagnement. » — L'équipe AIPAC" }],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Des partenaires engagés" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Ce résultat n'aurait pas été possible sans la contribution de deux partenaires énergéticiens qui ont joué pleinement le jeu :" }],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "link", attrs: { href: "#", target: "_blank" } }], text: "EBS Énergie" },
                  { type: "text", text: " — dont l'implication a été essentielle pour qualifier et valider le dossier CEE." },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "link", attrs: { href: "#", target: "_blank" } }], text: "PC Rénovation" },
                  { type: "text", text: " — qui a contribué à la concrétisation du projet sur le terrain." },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "13 vélos, 13 opportunités" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Aujourd'hui, 13 salariés en parcours d'insertion disposent d'un vélo cargo. C'est 13 freins levés, 13 personnes qui peuvent s'engager dans une démarche de formation ou d'emploi sans que le « comment je fais pour y aller » soit un obstacle." }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Mobilité, autonomie, dignité — trois mots qui résument l'impact réel d'un dossier bien construit." }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "C'est exactement pour ça que nous faisons ce métier." }],
      },
    ],
  };

  const existing = await prisma.article.findFirst({ where: { title: "13 vélos cargo pour lever le frein mobilité" } });
  if (!existing) {
    await prisma.article.create({
      data: {
        title:       "13 vélos cargo pour lever le frein mobilité",
        subtitle:    "Comment l'AIPAC a transformé l'accompagnement vers l'emploi grâce aux Certificats d'Économie d'Énergie.",
        category:    "Réussite client",
        image:       "/img/blog/aipac-mobility.jpg",
        imageAlt:    "Les 13 vélos cargo de l'AIPAC Mobility",
        content:     JSON.stringify(aipacContent),
        readTime:    "3 min",
        date:        "2025",
        published:   true,
        linkedinUrl: null,
        tags:        JSON.stringify(["CEE", "Insertion professionnelle", "Mobilité", "Association"]),
      },
    });
    console.log("  ✓ Article AIPAC Mobility créé");
  } else {
    console.log("  · Article AIPAC déjà en base");
  }

  // ── Références (Réalisations) ────────────────────────────────────────────────
  const refs = [
    { name: "SCI JABALI",      description: "Action Logement / ANAH — 600 000 €",                         order: 1 },
    { name: "SIAE",            description: "Fonds Européens — 600 000 €",                                 order: 2 },
    { name: "SIAE",            description: "Fonds Région Nouvelle-Aquitaine — 400 000 €",                 order: 3 },
    { name: "SAS MADONNA",     description: "CEE (Certificats d'Économie d'Énergie) — 268 000 €",          order: 4 },
    { name: "SAS GASCOGNE",    description: "Fonds Européens — 220 000 €",                                 order: 5 },
    { name: "SCI CALADORES",   description: "CEE (Certificats d'Économie d'Énergie) — 120 000 €",          order: 6 },
    { name: "SCI JABALI",      description: "CEE (Certificats d'Économie d'Énergie) — 98 000 €",           order: 7 },
    { name: "SCI LASSIESO",    description: "CEE (Certificats d'Économie d'Énergie) — 85 000 €",           order: 8 },
  ];

  const existingRefs = await prisma.reference.count();
  if (existingRefs === 0) {
    await prisma.reference.createMany({ data: refs });
    console.log(`  ✓ ${refs.length} références créées`);
  } else {
    console.log("  · Références déjà en base");
  }

  // ── Logos ────────────────────────────────────────────────────────────────────
  const logos = [
    { name: "Logo 128 × 128 px", file: "/img/logo/logo-cabinet-martin-ma-128x128.png", format: "PNG" },
    { name: "Logo 256 × 256 px", file: "/img/logo/logo-cabinet-martin-ma-256x256.png", format: "PNG" },
    { name: "Logo 512 × 512 px", file: "/img/logo/logo-cabinet-martin-ma-512x512.png", format: "PNG" },
  ];

  const existingLogos = await prisma.logo.count();
  if (existingLogos === 0) {
    await prisma.logo.createMany({ data: logos });
    console.log(`  ✓ ${logos.length} logos créés`);
  } else {
    console.log("  · Logos déjà en base");
  }

  // ── Guides ────────────────────────────────────────────────────────────────────
  const guides = [
    { title: "Comment fonctionne un CEE ?",       description: "Comprendre les Certificats d'Économie d'Énergie en 5 minutes.", status: "coming-soon" },
    { title: "Checklist dossier de financement",  description: "Les pièces indispensables pour constituer un dossier solide.",  status: "coming-soon" },
    { title: "Les dispositifs 2025",              description: "Tour d'horizon des aides disponibles cette année.",             status: "coming-soon" },
  ];

  const existingGuides = await prisma.guide.count();
  if (existingGuides === 0) {
    await prisma.guide.createMany({ data: guides });
    console.log(`  ✓ ${guides.length} guides créés`);
  } else {
    console.log("  · Guides déjà en base");
  }

  console.log("\n✅ Seed terminé !");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
