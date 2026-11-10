import React from 'react';
import { notFound } from 'next/navigation';
import ArticleForm from '@/components/admin/ArticleForm';
import { getArticleBySlug, getCategories, getUsers } from '@/lib/db';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const [article, categories, authors] = await Promise.all([
    getArticleBySlug(id),
    getCategories(),
    getUsers(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ArticleForm initialData={article} categories={categories} authors={authors} isEdit={true} />
    </div>
  );
}
