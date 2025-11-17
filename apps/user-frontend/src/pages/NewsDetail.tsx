import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Heart,
  Share2,
  Eye,
  Clock,
  BookOpen,
  Calendar,
  Tag,
  CheckCircle2,
  Facebook,
  Twitter,
  Link as LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useArticleBySlug, useRelatedArticles } from '@/hooks/useArticles';
import { ArticleDetailSkeleton } from '@/components/ArticleCardSkeleton';
import {
  calculateReadTime,
  extractFirstImage,
  getPlaceholderImage,
  sanitizeHtml,
  generateExcerpt,
} from '@/lib/article-utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Fetch article by slug
  const {
    data: articleData,
    isLoading: isLoadingArticle,
    error: articleError,
  } = useArticleBySlug(slug || '');

  const article = articleData?.data;

  // Fetch related articles if article has category
  const { data: relatedData, isLoading: isLoadingRelated } = useRelatedArticles(
    article?.categoryId,
    article?.id,
    2,
  );

  const relatedArticles = relatedData?.data?.items?.filter((item) => item.id !== article?.id) || [];

  const [stats, setStats] = useState({
    likes: 0,
    views: 0,
  });

  const handleLike = () => {
    setLiked(!liked);
    setStats((prev) => ({
      ...prev,
      likes: liked ? prev.likes - 1 : prev.likes + 1,
    }));
    toast.success(liked ? 'Đã bỏ thích' : 'Đã thích bài viết');
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Đã bỏ lưu' : 'Đã lưu bài viết');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article?.title,
          text: article?.excerpt || generateExcerpt(article?.content || '', 150),
          url: window.location.href,
        })
        .catch(() => {
          // Fallback to copy
          navigator.clipboard.writeText(window.location.href);
          toast.success('Đã sao chép liên kết');
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép liên kết');
    }
  };

  const handleSocialShare = (platform: 'facebook' | 'twitter') => {
    if (typeof window === 'undefined') return;

    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedText = encodeURIComponent(article?.title || 'Chia sẻ từ Vinh Xuân');

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    };

    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: vi });
    } catch {
      return '';
    }
  };

  // Loading state
  if (isLoadingArticle) {
    return <ArticleDetailSkeleton />;
  }

  // Error state - article not found
  if (articleError || !article) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Không tìm thấy bài viết</p>
          <Button asChild>
            <Link to="/news">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Tin tức
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Only show published NEWS articles
  if (article.status !== 'PUBLISHED' || article.type !== 'NEWS') {
    return <Navigate to="/news" replace />;
  }

  const insightItems = [
    {
      title: 'Ngày xuất bản',
      description: formatDate(article.publishedAt || article.createdAt),
      icon: Calendar,
    },
    {
      title: 'Thời lượng đọc',
      description: calculateReadTime(article.content),
      icon: Clock,
    },
    {
      title: 'Chuyên mục',
      description: article.category?.name || 'Tin tức',
      icon: Tag,
    },
  ];

  const highlightCards = [
    {
      title: 'Nội dung chính',
      description: article.excerpt || generateExcerpt(article.content, 180),
      icon: BookOpen,
    },
    {
      title: 'Nguồn thông tin',
      description: article.isCrawled
        ? 'Tổng hợp từ nguồn đối tác'
        : 'Biên soạn bởi đội ngũ Vinh Xuân',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-4xl mx-auto px-3 xs:px-4 xxs:px-6 sm:px-6 lg:px-8 py-6 xs:py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 hover:bg-accent/10" asChild>
          <Link to="/news">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại Tin tức
          </Link>
        </Button>

        <section className="space-y-8">
          <header className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg p-6 xs:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-gradient-to-r from-accent/90 to-primary text-white">
                {article.category?.name || 'Tin tức'}
              </Badge>
              {article.isCrawled && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Tin bên ngoài
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-accent/70 font-semibold">
                Bản tin nổi bật
              </p>
              <h1 className="font-sans text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
                {article.title}
              </h1>
              {(article.excerpt || article.content) && (
                <p className="text-lg xs:text-xl text-gray-600 leading-relaxed">
                  {article.excerpt || generateExcerpt(article.content, 220)}
                </p>
              )}
            </div>

            <div className="flex flex-col border-y border-gray-100 py-6 gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2 text-xs xs:text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
                  <Calendar className="w-3 xs:w-4 h-3 xs:h-4" />
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
                  <Clock className="w-3 xs:w-4 h-3 xs:h-4" />
                  {calculateReadTime(article.content)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
                  <Eye className="w-3 xs:w-4 h-3 xs:h-4" />
                  {stats.views.toLocaleString()} lượt xem
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
                  <Tag className="w-3 xs:w-4 h-3 xs:h-4" />
                  {article.type === 'NEWS' ? 'Tin tức' : article.type}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={cn(
                    'transition-colors px-4',
                    liked ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100' : '',
                  )}
                >
                  <Heart className={cn('w-4 h-4 mr-2', liked && 'fill-current')} />
                  {stats.likes}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={cn(
                    'transition-colors px-4',
                    bookmarked ? 'text-accent border-accent/20 bg-accent/5' : '',
                  )}
                >
                  <BookOpen className={cn('w-4 h-4', bookmarked && 'fill-current')} />
                </Button>
                <Button variant="default" size="sm" onClick={handleShare} className="px-4">
                  <Share2 className="w-4 h-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <article className="space-y-6">
              {(article.thumbnail || extractFirstImage(article.content)) && (
                <Card className="overflow-hidden border-0 shadow-xl rounded-3xl">
                  <div className="aspect-video">
                    <img
                      src={
                        article.thumbnail ||
                        extractFirstImage(article.content) ||
                        getPlaceholderImage(article.category?.name)
                      }
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              )}

              <Card className="border-0 shadow-lg rounded-3xl">
                <CardContent className="p-6 xs:p-8">
                  <div
                    className="prose prose-lg max-w-none prose-img:rounded-2xl prose-headings:font-semibold"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
                  />
                </CardContent>
              </Card>

              {article.sourceUrl && (
                <Card className="border border-blue-100 bg-blue-50/50 rounded-2xl">
                  <CardContent className="p-6">
                    <p className="text-sm text-blue-900 mb-2 font-semibold">Nguồn tham khảo</p>
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-700 hover:text-blue-900 break-all font-medium"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      {article.sourceUrl}
                    </a>
                  </CardContent>
                </Card>
              )}
            </article>

            <aside className="space-y-6">
              <Card className="border-0 shadow-lg rounded-3xl">
                <CardHeader>
                  <CardTitle>Bài viết liên quan</CardTitle>
                  <CardDescription>Tiếp tục đọc các chủ đề tương tự</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingRelated ? (
                    <div className="space-y-4">
                      {[1, 2].map((placeholder) => (
                        <div key={placeholder} className="animate-pulse space-y-3">
                          <div className="h-32 w-full rounded-2xl bg-muted" />
                          <div className="h-4 w-3/4 rounded-full bg-muted" />
                          <div className="h-3 w-1/2 rounded-full bg-muted" />
                        </div>
                      ))}
                    </div>
                  ) : relatedArticles.length > 0 ? (
                    <div className="space-y-4">
                      {relatedArticles.map((related) => (
                        <Link
                          key={related.id}
                          to={`/news/${related.slug}`}
                          className="block group rounded-2xl border border-transparent hover:border-accent/30 p-3 transition-all"
                        >
                          <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-3">
                            <img
                              src={
                                related.thumbnail ||
                                extractFirstImage(related.content) ||
                                getPlaceholderImage(related.category?.name)
                              }
                              alt={related.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {related.category?.name || 'Tin tức'}
                            </Badge>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {calculateReadTime(related.content)}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 group-hover:text-accent">
                            {related.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {related.excerpt || generateExcerpt(related.content, 80)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Hiện chưa có bài viết liên quan nào cho chủ đề này.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-3xl">
                <CardHeader>
                  <CardTitle>Thông tin nhanh</CardTitle>
                  <CardDescription>Bức tranh tổng quan của bài viết</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insightItems.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4"
                    >
                      <div className="h-10 w-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.title}</p>
                        <p className="text-base font-medium text-gray-900">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-3xl">
                <CardHeader>
                  <CardTitle>Điểm nhấn nội dung</CardTitle>
                  <CardDescription>Những gì bạn nên quan tâm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {highlightCards.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="rounded-2xl bg-gradient-to-r from-accent/5 to-primary/5 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2 text-accent font-semibold">
                        <highlight.icon className="w-4 h-4" />
                        {highlight.title}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg rounded-3xl">
                <CardHeader>
                  <CardTitle>Chia sẻ nhanh</CardTitle>
                  <CardDescription>Tăng phạm vi tiếp cận bài viết</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                    Sao chép liên kết
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleSocialShare('facebook')}
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleSocialShare('twitter')}
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewsDetail;
