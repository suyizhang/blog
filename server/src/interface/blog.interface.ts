export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  tags?: string[];
  category?: string;
  status?: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
  count: number;
}

export interface BlogTag {
  name: string;
  slug: string;
  count: number;
}

export interface GetPostsParams {
  page: number;
  pageSize: number;
  category?: string;
  tag?: string;
  status?: 'draft' | 'published';
}

export interface GetPostsResult {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreatePostParams {
  title: string;
  content: string;
  description?: string;
  tags?: string[];
  category?: string;
  status?: 'draft' | 'published';
}

export interface UpdatePostParams extends Partial<CreatePostParams> {
  slug: string;
}