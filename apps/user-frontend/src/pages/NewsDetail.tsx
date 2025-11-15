import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Clock,
  BookOpen,
  Calendar,
  Tag,
  CheckCircle2,
  Star,
  Send,
  Reply,
  ThumbsUp,
  Flag,
  MoreHorizontal,
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
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Fetch article by slug
  const {
    data: articleData,
    isLoading: isLoadingArticle,
    error: articleError,
  } = useArticleBySlug(slug || '');

  const article = articleData?.data;

  // Fetch related articles if article has category
  const {
    data: relatedData,
    isLoading: isLoadingRelated,
  } = useRelatedArticles(article?.categoryId, article?.id, 2);

  const relatedArticles = relatedData?.data?.items?.filter(
    (item) => item.id !== article?.id
  ) || [];

  const [stats, setStats] = useState({
    likes: 0,
    views: 0,
    comments: 0,
  });

  // Mock comments (in real app, fetch from API)
  const comments = [
    {
      id: 1,
      author: 'Trần Minh Tuấn',
      authorTitle: 'Công chứng viên',
      avatar: '',
      content:
        'Bài viết rất hay về các yêu cầu mới. Các giao thức xác minh kỹ thuật số đặc biệt quan trọng đối với thực tiễn của chúng tôi.',
      timestamp: '2 giờ trước',
      likes: 12,
      replies: [],
    },
    {
      id: 2,
      author: 'Lê Thị Hương',
      authorTitle: 'Chuyên viên Công chứng',
      avatar: '',
      content:
        'Việc tăng bảo hiểm trách nhiệm nghề nghiệp là đáng kể. Đối với các văn phòng nhỏ, điều này có thể là thách thức.',
      timestamp: '4 giờ trước',
      likes: 18,
      replies: [],
    },
  ];

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

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      toast.success('Bình luận đã được đăng');
      setNewComment('');
      setStats((prev) => ({
        ...prev,
        comments: prev.comments + 1,
      }));
    }
  };

  const handleReplySubmit = (commentId: number) => {
    if (replyText.trim()) {
      toast.success('Trả lời đã được đăng');
      setReplyText('');
      setReplyTo(null);
    }
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

        {/* Article Header */}
        <article className="space-y-8">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-gradient-to-r from-accent/10 to-accent/5 text-accent border-accent/20 text-white">
                {article.category?.name || 'Tin tức'}
              </Badge>
              {article.isCrawled && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Tin bên ngoài
                </Badge>
              )}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{stats.views.toLocaleString()} lượt xem</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{calculateReadTime(article.content)}</span>
                </div>
              </div>
            </div>

            <h1 className="font-sans text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {article.title}
            </h1>

            {(article.excerpt || article.content) && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {article.excerpt || generateExcerpt(article.content, 200)}
              </p>
            )}

            {/* Author Info */}
            <div className="flex flex-col xxs:flex-row xxs:items-center xxs:justify-between py-6 border-y border-gray-200 gap-4">
              <div className="flex items-center space-x-3 xs:space-x-4">
                <Avatar className="h-10 xs:h-12 w-10 xs:w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base xs:text-lg">
                    {article.author?.fullName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 text-sm xs:text-base">
                      {article.author?.fullName || 'Admin'}
                    </h3>
                    <CheckCircle2 className="w-3 xs:w-4 h-3 xs:h-4 text-blue-500" />
                  </div>
                  <p className="text-xs xs:text-sm text-accent">Tác giả</p>
                  <div className="flex items-center space-x-2 text-xs xs:text-sm text-muted-foreground">
                    <Calendar className="w-3 xs:w-4 h-3 xs:h-4" />
                    <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 xs:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={cn(
                    'transition-colors text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2',
                    liked
                      ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100'
                      : 'hover:text-red-500'
                  )}
                >
                  <Heart className={cn('w-3 xs:w-4 h-3 xs:h-4 mr-1 xs:mr-2', liked && 'fill-current')} />
                  <span className="hidden xs:inline">{stats.likes}</span>
                  <span className="xs:hidden">
                    {stats.likes > 999 ? `${Math.floor(stats.likes / 1000)}k` : stats.likes}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={cn(
                    'transition-colors px-2 xs:px-3 py-1 xs:py-2',
                    bookmarked ? 'text-accent border-accent/20 bg-accent/5' : ''
                  )}
                >
                  <BookOpen className={cn('w-3 xs:w-4 h-3 xs:h-4', bookmarked && 'fill-current')} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="px-2 xs:px-3 py-1 xs:py-2"
                >
                  <Share2 className="w-3 xs:w-4 h-3 xs:h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {(article.thumbnail || extractFirstImage(article.content)) && (
            <div className="aspect-video overflow-hidden rounded-xl shadow-lg">
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
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
          />

          {/* Source URL */}
          {article.sourceUrl && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                {article.isCrawled ? 'Bài viết gốc từ:' : 'Nguồn tham khảo:'}
              </p>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm break-all"
              >
                {article.sourceUrl}
              </a>
            </div>
          )}

          {/* Author Bio */}
          {article.author && (
            <Card className="border-0 shadow-md bg-gradient-to-r from-accent/5 to-accent/10">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                      {article.author.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {article.author.fullName}
                      </h4>
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-accent font-medium mb-3">Tác giả</p>
                    <p className="text-gray-600 leading-relaxed">
                      Chuyên gia về {article.category?.name || 'lĩnh vực công chứng'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-accent" />
                Bình luận ({stats.comments})
              </h2>
            </div>

            {/* Comment Form */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-none border-2 focus:border-accent"
                  />
                  <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3">
                    <p className="text-xs xs:text-sm text-muted-foreground">
                      Hãy tôn trọng và mang tính xây dựng trong bình luận của bạn
                    </p>
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim()}
                      className="text-xs xs:text-sm px-4 xs:px-6 py-2 xs:py-3"
                    >
                      <Send className="w-3 xs:w-4 h-3 xs:h-4 mr-1 xs:mr-2" />
                      <span className="hidden xs:inline">Đăng bình luận</span>
                      <span className="xs:hidden">Đăng</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                              {comment.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h5 className="font-semibold text-gray-900">{comment.author}</h5>
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            </div>
                            <p className="text-sm text-accent">{comment.authorTitle}</p>
                            <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-gray-700 leading-relaxed ml-10 xs:ml-13">{comment.content}</p>

                      <div className="flex flex-wrap items-center gap-2 xs:gap-4 ml-10 xs:ml-13">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-red-500 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2 h-auto"
                        >
                          <ThumbsUp className="w-3 xs:w-4 h-3 xs:h-4 mr-1" />
                          <span className="hidden xs:inline">{comment.likes}</span>
                          <span className="xxs:hidden">{comment.likes > 99 ? '99+' : comment.likes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          className="text-muted-foreground hover:text-accent text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2 h-auto"
                        >
                          <Reply className="w-3 xs:w-4 h-3 xs:h-4 mr-1" />
                          <span className="xs:inline">Trả lời</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2 h-auto"
                        >
                          <Flag className="w-3 xs:w-4 h-3 xs:h-4 mr-1" />
                          <span className="xs:inline">Báo cáo</span>
                        </Button>
                      </div>

                      {/* Reply Form */}
                      {replyTo === comment.id && (
                        <div className="ml-10 xs:ml-13 mt-4 space-y-3">
                          <Textarea
                            placeholder={`Trả lời ${comment.author}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[60px] xs:min-h-[80px] resize-none text-sm"
                          />
                          <div className="flex flex-col xs:flex-row gap-2 xs:gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleReplySubmit(comment.id)}
                              disabled={!replyText.trim()}
                              className="text-xs xs:text-sm px-3 xs:px-4 py-2"
                            >
                              <span className="xs:inline">Đăng trả lời</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReplyTo(null)}
                              className="text-xs xs:text-sm px-3 xs:px-4 py-2"
                            >
                              <span className="xs:inline">Hủy</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Related Articles */}
          {!isLoadingRelated && relatedArticles.length > 0 && (
            <section className="pt-12 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.id} to={`/news/${related.slug}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                      <div className="aspect-video overflow-hidden">
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
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {related.category?.name || 'Tin tức'}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{calculateReadTime(related.content)}</span>
                          </div>
                        </div>
                        <CardTitle className="font-sans text-lg group-hover:text-accent transition-colors">
                          {related.title}
                        </CardTitle>
                        <CardDescription>
                          {related.excerpt || generateExcerpt(related.content, 100)}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;
