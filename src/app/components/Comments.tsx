'use client';

import { useEffect, useRef } from 'react';
// 需要先安装 next-themes 包：npm install next-themes
import { useTheme } from 'next-themes';

interface CommentsProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

export default function Comments({ repo, repoId, category, categoryId }: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', 'zh-CN');

    containerRef.current.appendChild(script);

    return () => {
      const giscusFrame = document.querySelector('iframe.giscus-frame');
      giscusFrame?.remove();
      script.remove();
    };
  }, [repo, repoId, category, categoryId, theme]);

  return (
    <div className="mt-20 pt-10 border-t dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">评论</h2>
      <div ref={containerRef} />
    </div>
  );
}