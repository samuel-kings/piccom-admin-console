import { fetchPosts } from '../services/post';
import { useDataCache } from './useDataCache';
import type { Post } from '../models/post';

interface PostsData {
  posts: Post[];
  total: number;
}

export const usePosts = (
  currentPage: number,
  searchQuery: string,
  statusFilter: string,
  itemsPerPage: number
) => {
  const { data, isLoading, error, refresh } = useDataCache<PostsData>({
    key: `posts-${currentPage}-${searchQuery}-${statusFilter}`,
    fetchData: () => fetchPosts({ searchQuery, statusFilter, currentPage, itemsPerPage }),
    dependencies: [currentPage, searchQuery, statusFilter, itemsPerPage]
  });

  return {
    posts: data?.posts || [],
    total: data?.total || 0,
    isLoading,
    error,
    refresh
  };
};