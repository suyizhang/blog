import { create } from 'zustand';
import { BlogPost } from './types';
import { getAllPosts } from './utils';

interface BlogStore {
  posts: BlogPost[];
  categories: { name: string; slug: string; count: number }[];
  tags: { name: string; slug: string; count: number }[];
  currentPost: BlogPost | null;
  isLoading: boolean;
  error: string | null;
  setPosts: (posts: BlogPost[]) => void;
  setCategories: (categories: { name: string; slug: string; count: number }[]) => void;
  setTags: (tags: { name: string; slug: string; count: number }[]) => void;
  setCurrentPost: (post: BlogPost | null) => void;
  fetchPosts: () => Promise<void>;
}

export const useBlogStore = create<BlogStore>((set) => ({
  posts: [],
  categories: [],
  tags: [],
  currentPost: null,
  isLoading: false,
  error: null,
  setPosts: (posts) => set({ posts }),
  setCategories: (categories) => set({ categories }),
  setTags: (tags) => set({ tags }),
  setCurrentPost: (post) => set({ currentPost: post }),
  fetchPosts: async () => {
    try {
      set({ isLoading: true, error: null });
      const posts = await getAllPosts();
      console.log(posts, '34');
      set({ posts, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '获取文章列表失败', isLoading: false });
    }
  },
}));