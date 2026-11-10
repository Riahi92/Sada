import React from 'react';
import ArticleForm from '@/components/admin/ArticleForm';
import { getCategories, getUsers } from '@/lib/db';

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    getCategories(),
    getUsers(),
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      <ArticleForm categories={categories} authors={authors} />
    </div>
  );
}
