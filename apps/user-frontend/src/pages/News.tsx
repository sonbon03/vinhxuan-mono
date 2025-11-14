import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Search,
  Calendar,
  Eye,
  Newspaper,
  TrendingUp,
  Users,
  Scale,
  AlertCircle,
  BookOpen,
  Star,
  MessageSquare,
  Heart,
  Share,
  Facebook,
  Twitter,
  Link as LinkIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import articlesService from '@/services/articles.service';
import { useBreakingNews } from '@/hooks/useArticles';
import { useDebounce } from '@/hooks/useDebounce';
import { ArticleCardSkeleton, BreakingNewsSkeleton } from '@/components/ArticleCardSkeleton';
import {
  calculateReadTime,
  extractFirstImage,
  getPlaceholderImage,
  formatTimeAgo,
  generateExcerpt,
} from '@/lib/article-utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

const News = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const limit = 9;

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 500);

  const categories = [
    { id: 'all', name: 'Tất cả tin tức', icon: Newspaper, color: 'text-black' },
    { id: 'real-estate', name: 'Công chứng BĐS', icon: TrendingUp, color: 'text-black' },
    { id: 'business', name: 'Công chứng DN', icon: Users, color: 'text-black' },
    { id: 'family', name: 'Thừa kế', icon: Users, color: 'text-black' },
    { id: 'notary', name: 'Chứng thực', icon: Scale, color: 'text-black' },
    { id: 'contract', name: 'Hợp đồng', icon: AlertCircle, color: 'text-black' },
    { id: 'legal', name: 'Pháp luật', icon: BookOpen, color: 'text-black' },
  ];

  // Fetch breaking news (top 3 latest)
  const { data: breakingNewsData, isLoading: isLoadingBreakingNews } = useBreakingNews(3);

  // Fetch main news articles with infinite query
  const {
    data: newsData,
    isLoading: isLoadingNews,
    error: newsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['news', debouncedSearch, selectedCategory],
    queryFn: ({ pageParam = 1 }) =>
      articlesService.getNews({
        page: pageParam,
        limit,
        search: debouncedSearch || undefined,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
        sortBy: 'publishedAt',
        sortOrder: 'DESC',
      }),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.page;
      const totalPages = Math.ceil(lastPage.data.total / lastPage.data.limit);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Flatten all pages into a single array
  const articles = useMemo(() => {
    return newsData?.pages.flatMap((page) => page.data.items) || [];
  }, [newsData]);

  const total = newsData?.pages[0]?.data?.total || 0;

  // Extract featured article (first one)
  const featuredArticle = articles[0];
  const sidebarArticles = articles.slice(1, 3);
  const regularArticles = articles.slice(3);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: vi }).toUpperCase();
    } catch {
      return '';
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Show error toast if API fails
  if (newsError) {
    toast.error('Không thể tải tin tức', {
      description: 'Vui lòng thử lại sau.',
    });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 xs:gap-6 py-5 xs:py-6">
            {/* Title Section */}
            <div className="flex-1">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-1">
                Tin tức Công chứng
              </h1>
              <div className="text-xs xs:text-sm text-gray-500 font-medium">
                {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: vi })}
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex-shrink-0 w-full md:w-auto">
              {/* Mobile: Clear Interactive Buttons */}
              <div className="md:hidden">
                <div className="flex gap-2.5">
                  <a
                    href="#"
                    className="group flex-1 px-5 py-3.5 text-base font-bold text-white bg-gradient-to-b from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-2xl shadow-lg hover:shadow-xl active:shadow-md active:scale-[0.96] transition-all duration-200 min-h-[56px] flex items-center justify-center cursor-pointer relative overflow-hidden"
                  >
                    <span className="relative z-10">Tin hôm nay</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a
                    href="#"
                    className="group flex-1 px-5 py-3.5 text-base font-bold text-gray-900 bg-white rounded-2xl border-[3px] border-gray-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:border-gray-500 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] hover:bg-gray-50 active:bg-gray-100 active:shadow-[0_2px_8px_rgba(0,0,0,0.1)] active:scale-[0.96] active:border-gray-400 transition-all duration-200 min-h-[56px] flex items-center justify-center cursor-pointer"
                  >
                    Tin nóng
                  </a>
                </div>
              </div>

              {/* Desktop: Modern Tabs */}
              <div className="hidden md:flex items-center bg-gray-50 rounded-lg p-1 gap-1">
                <a
                  href="#"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-b from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-md transition-all duration-200 shadow-sm"
                >
                  Tin hôm nay
                </a>
                <a
                  href="#"
                  className="px-5 py-2 text-sm font-semibold text-gray-700 rounded-md transition-all duration-200 hover:text-gray-900 hover:bg-white"
                >
                  Tin nóng
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 xxs:px-6 py-6 xs:py-8">
        {/* NY Times Style Breaking News */}
        {isLoadingBreakingNews ? (
          <BreakingNewsSkeleton />
        ) : (
          breakingNewsData?.data?.items[0] && (
            <div className="border-t-4 border-primary bg-white mb-12">
              <div className="p-4 border-l-4 border-primary">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-white px-2 py-1 text-xs font-bold uppercase tracking-wide">
                    Breaking
                  </div>
                  <div className="flex-1">
                    <Link to={`/news/${breakingNewsData.data.items[0].slug}`}>
                      <div className="text-black font-sans text-lg leading-tight mb-2 hover:text-gray-700 cursor-pointer">
                        {breakingNewsData.data.items[0].title}
                      </div>
                    </Link>
                    <div className="text-gray-600 text-sm">
                      {formatTimeAgo(
                        breakingNewsData.data.items[0].publishedAt ||
                          breakingNewsData.data.items[0].createdAt,
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* NY Times Style Navigation */}
        <div className="mb-8 xs:mb-12">
          {/* Mobile: Horizontal Scroll Categories */}
          <div className="md:hidden mb-6">
            <div className="flex overflow-x-auto space-x-2 xxs:space-x-3 pb-2 -mx-3 px-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex space-x-2 xxs:space-x-3 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={cn(
                      'flex-shrink-0 px-3 xxs:px-4 py-1.5 xxs:py-2 rounded-full text-xs xxs:text-sm font-medium transition-all duration-300 border inline-flex items-center gap-1.5',
                      selectedCategory === category.id
                        ? 'bg-black text-white border-black shadow-[0_1px_0_rgba(0,0,0,0.2)]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-black',
                    )}
                  >
                    <category.icon
                      className={cn(
                        'w-3 h-3',
                        selectedCategory === category.id ? 'text-white' : 'text-gray-500',
                      )}
                    />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Traditional Layout */}
          <div className="hidden md:flex flex-wrap gap-1 text-sm text-gray-600 border-b border-gray-200 pb-4 mb-8 relative">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  'px-4 py-2 hover:text-black transition-colors font-medium inline-flex items-center gap-2',
                  selectedCategory === category.id
                    ? 'text-black border-b-2 border-black -mb-[1px] relative'
                    : 'text-gray-600',
                )}
              >
                <category.icon
                  className={cn(
                    'w-4 h-4',
                    selectedCategory === category.id ? 'text-black' : 'text-gray-400',
                  )}
                />
                {category.name}
                {selectedCategory === category.id && (
                  <span className="absolute -bottom-[9px] left-0 right-0 mx-auto h-[2px] w-12 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 border border-gray-300 focus:border-black transition-colors bg-white text-sm rounded-full"
              />
            </div>
            <div className="text-sm text-gray-500 font-light text-center sm:text-right">
              {total} bài viết
            </div>
          </div>
        </div>

        {/* Error State */}
        {newsError && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Không thể tải tin tức. Vui lòng thử lại sau.</p>
            <Button onClick={() => window.location.reload()}>Tải lại</Button>
          </div>
        )}

        {/* Loading State */}
        {isLoadingNews && (
          <div className="border-t border-gray-300 pt-8 xs:pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xs:gap-8">
              <div className="lg:col-span-8">
                <ArticleCardSkeleton variant="featured" />
              </div>
              <div className="lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-8">
                <div className="space-y-4">
                  <ArticleCardSkeleton variant="sidebar" />
                  <ArticleCardSkeleton variant="sidebar" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8 mt-12">
              {[...Array(6)].map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingNews && articles.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Không tìm thấy bài viết nào</p>
            <p className="text-gray-400 text-sm">
              {searchQuery
                ? 'Thử tìm kiếm với từ khóa khác'
                : 'Hiện tại chưa có tin tức trong danh mục này'}
            </p>
          </div>
        )}

        {/* NY Times Style Article Grid */}
        {!isLoadingNews && articles.length > 0 && (
          <div className="border-t border-gray-300 pt-8 xs:pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xs:gap-8">
              {/* Main Featured Article */}
              {featuredArticle && (
                <div className="lg:col-span-8">
                  <Link to={`/news/${featuredArticle.slug}`}>
                    <article className="mb-8 xs:mb-12 cursor-pointer group">
                      <div className="relative aspect-[16/10] mb-4 xs:mb-6 overflow-hidden rounded-lg xs:rounded-none">
                        <img
                          src={
                            featuredArticle.sourceUrl ||
                            extractFirstImage(featuredArticle.content) ||
                            getPlaceholderImage(featuredArticle.category?.name)
                          }
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-gray-900 shadow-sm">
                            <Star className="w-3 h-3 text-amber-500" />
                            Nổi bật
                          </span>
                        </div>
                      </div>
                      <div className="max-w-2xl">
                        <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2 xs:mb-3">
                          {featuredArticle.category?.name || 'Tin tức'}
                        </div>
                        <h1 className="font-sans text-xl xs:text-2xl xxs:text-3xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 xs:mb-4 leading-tight hover:text-gray-700 cursor-pointer transition-colors">
                          {featuredArticle.title}
                        </h1>
                        <p className="text-sm xs:text-base xxs:text-lg lg:text-lg text-gray-700 mb-4 xs:mb-6 leading-relaxed">
                          {featuredArticle.excerpt || generateExcerpt(featuredArticle.content, 200)}
                        </p>
                        <div className="flex flex-col xxs:flex-row xxs:items-center xxs:justify-between gap-3 xxs:gap-4">
                          <div className="flex flex-col xxs:flex-row xxs:items-center text-xs xs:text-sm xxs:text-sm text-gray-500 gap-1 xxs:gap-0">
                            <span className="font-medium text-black xxs:mr-2">
                              By {featuredArticle.author?.fullName || 'Admin'}
                            </span>
                            <div className="flex items-center">
                              <span className="hidden xxs:inline mr-4">•</span>
                              <span>
                                {formatDate(
                                  featuredArticle.publishedAt || featuredArticle.createdAt,
                                )}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{calculateReadTime(featuredArticle.content)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              )}

              {/* Sidebar */}
              {sidebarArticles.length > 0 && (
                <div className="lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-8 mt-6 xs:mt-8 lg:mt-0">
                  <div className="mb-6 xs:mb-8">
                    <h2 className="font-sans text-lg xs:text-xl xxs:text-2xl lg:text-2xl font-bold text-black mb-4 xs:mb-6 border-b border-gray-200 pb-2">
                      Tin khác
                    </h2>
                    <div className="space-y-4 xs:space-y-6">
                      {sidebarArticles.map((article) => (
                        <Link key={article.id} to={`/news/${article.slug}`}>
                          <article className="border-b border-gray-100 pb-4 xs:pb-6 last:border-b-0 group">
                            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
                              {article.category?.name || 'Tin tức'}
                            </div>
                            <h3 className="font-sans text-base xs:text-lg xxs:text-xl font-bold text-black mb-2 leading-tight hover:text-accent cursor-pointer transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 text-xs xs:text-sm xxs:text-sm mb-3 leading-relaxed">
                              {article.excerpt || generateExcerpt(article.content, 120)}
                            </p>
                            <div className="space-y-2 xs:space-y-3">
                              <div className="flex flex-col xs:flex-row xs:items-center text-xs text-gray-500 gap-1 xs:gap-0">
                                <span className="font-medium text-black xs:mr-2">
                                  {article.author?.fullName || 'Admin'}
                                </span>
                                <div className="flex items-center">
                                  <span className="hidden xs:inline mr-2">•</span>
                                  <span>
                                    {formatDate(article.publishedAt || article.createdAt)}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span>{calculateReadTime(article.content)}</span>
                                </div>
                              </div>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Articles Grid */}
            {regularArticles.length > 0 && (
              <div className="border-t border-gray-300 pt-8 xs:pt-12 mt-8 xs:mt-12">
                <h2 className="font-sans text-xl xs:text-2xl xxs:text-3xl sm:text-3xl font-bold text-black mb-6 xs:mb-8">
                  Bài viết mới nhất
                  <span className="ml-3 align-middle inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
                  {regularArticles.map((article) => (
                    <Link key={article.id} to={`/news/${article.slug}`}>
                      <article className="group hover:shadow-md transition-shadow rounded-lg">
                        <div className="relative aspect-[4/3] mb-3 xs:mb-4 overflow-hidden rounded-lg">
                          <img
                            src={
                              article.sourceUrl ||
                              extractFirstImage(article.content) ||
                              getPlaceholderImage(article.category?.name)
                            }
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-2 left-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-white/90 text-gray-900 shadow">
                              <Calendar className="w-3 h-3" />
                              {calculateReadTime(article.content)}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
                          {article.category?.name || 'Tin tức'}
                        </div>
                        <h3 className="font-sans text-base xs:text-lg xxs:text-xl sm:text-xl font-bold text-black mb-2 xs:mb-3 leading-tight group-hover:text-accent cursor-pointer transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-xs xs:text-sm xxs:text-sm mb-3 xs:mb-4 leading-relaxed">
                          {article.excerpt || generateExcerpt(article.content, 90)}
                        </p>
                        <div className="space-y-2 xs:space-y-3">
                          <div className="flex flex-col xs:flex-row xs:items-center text-xs text-gray-500 gap-1 xs:gap-0">
                            <span className="font-medium text-black xs:mr-2">
                              {article.author?.fullName || 'Admin'}
                            </span>
                            <div className="flex items-center">
                              <span className="hidden xs:inline mr-2">•</span>
                              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                              <span className="mx-2">•</span>
                              <span>{calculateReadTime(article.content)}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {!isLoadingNews && (
              <div className="text-center mt-8 xs:mt-12 pt-6 xs:pt-8 border-t border-gray-200">
                {hasNextPage && (
                  <button
                    onClick={handleLoadMore}
                    disabled={isFetchingNextPage}
                    className="px-6 xs:px-8 py-2 xs:py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors font-medium text-sm xs:text-base rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm bài viết'}
                  </button>
                )}
                <p className="text-xs xs:text-sm text-gray-500 mt-3 xs:mt-4">
                  Hiển thị {articles.length} trong tổng số {total} bài viết
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
