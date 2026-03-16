import { prisma } from "@/app/lib/prisma";
import ArticleForm from "../../_components/ArticleForm";
import { notFound } from "next/navigation";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <ArticleForm
      initialData={{
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        category: article.category,
        image: article.image,
        imageAlt: article.imageAlt,
        content: JSON.parse(article.content || "{}"),
        readTime: article.readTime,
        date: article.date,
        published: article.published,
        linkedinUrl: article.linkedinUrl,
        tags: JSON.parse(article.tags || "[]"),
      }}
    />
  );
}
