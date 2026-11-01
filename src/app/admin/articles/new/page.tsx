import React from 'react';
import ArticleForm from '@/components/admin/ArticleForm';
import { getCategories } from '@/lib/db';

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div className="max-w-6xl mx-auto">
      <ArticleForm categories={categories} />
    </div>
  );
}
