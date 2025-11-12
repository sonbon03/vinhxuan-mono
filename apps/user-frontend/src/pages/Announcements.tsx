import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  DollarSign,
  Home,
  Briefcase,
  FileText,
  Clock,
  User,
  Edit,
  Trash2,
  Lock,
  Star,
  Eye,
  LogIn,
  Shield,
  CheckCircle2,
  Upload,
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useListings, useCreateListing, useLikeListing, useDeleteListing } from "@/hooks/useListings";
import { useDebounce } from "@/hooks/useDebounce";
import { ListingCardSkeletonGrid } from "@/components/ListingCardSkeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createListingSchema, type CreateListingFormData } from "@/schemas/listing.schema";

const Announcements = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Categories - matching backend structure
  const categories = [
    { id: "all", name: "Tất cả tin đăng", icon: FileText },
    { id: "property-sale", name: "Bất động sản", icon: Home },
    { id: "notary-services", name: "Dịch vụ công chứng", icon: FileText },
    { id: "legal-services", name: "Dịch vụ pháp lý", icon: Briefcase },
    { id: "document-prep", name: "Soạn thảo hồ sơ", icon: FileText },
    { id: "consultation", name: "Tư vấn pháp lý", icon: User }
  ];

  // Build query parameters
  const listingsQuery = useMemo(() => ({
    page: currentPage,
    limit: 9,
    search: debouncedSearch || undefined,
    categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  }), [currentPage, debouncedSearch, selectedCategory, minPrice, maxPrice, sortBy, sortOrder]);

  // Fetch listings with React Query
  const { data, isLoading, isError, error } = useListings(listingsQuery);
  const createListingMutation = useCreateListing();
  const likeMutation = useLikeListing();
  const deleteMutation = useDeleteListing();

  // Form setup with react-hook-form + zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      price: undefined,
      location: "",
      contactInfo: "",
      images: [],
    },
  });

  const watchedContent = watch("content");

  // Handle create listing
  const onSubmitListing = async (formData: CreateListingFormData) => {
    if (!isAuthenticated) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để tạo tin đăng.",
        variant: "destructive",
      });
      navigate("/login?redirect=/announcements");
      return;
    }

    try {
      // Transform form data to match API structure
      const listingData = {
        title: formData.title,
        content: formData.content,
        price: formData.price || 0,
        categoryId: formData.categoryId || undefined,
        images: formData.images || [],
      };

      await createListingMutation.mutateAsync(listingData);

      // Reset form and close dialog
      reset();
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error already handled in mutation
      console.error("Create listing error:", error);
    }
  };

  // Handle like listing
  const handleLike = async (listingId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thích tin đăng.",
        variant: "destructive",
      });
      return;
    }

    try {
      await likeMutation.mutateAsync(listingId);
    } catch (error) {
      // Error already handled in mutation
    }
  };

  // Handle delete listing
  const handleDelete = async (listingId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (window.confirm("Bạn có chắc chắn muốn xóa tin đăng này?")) {
      try {
        await deleteMutation.mutateAsync(listingId);
      } catch (error) {
        // Error already handled in mutation
      }
    }
  };

  // Format relative date
  const formatRelativeDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return "Không xác định";
    }
  };

  // Check if listing is new (within 2 days)
  const isNew = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= 2;
  };

  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return "Liên hệ";
    return `${price.toLocaleString('vi-VN')} VNĐ`;
  };

  // Get listings from API response
  const listings = data?.data?.items || [];
  const totalItems = data?.data?.total || 0;
  const hasMore = currentPage * 9 < totalItems;

  // Handle load more
  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    switch (value) {
      case "recent":
        setSortBy("createdAt");
        setSortOrder("DESC");
        break;
      case "oldest":
        setSortBy("createdAt");
        setSortOrder("ASC");
        break;
      case "price-low":
        setSortBy("price");
        setSortOrder("ASC");
        break;
      case "price-high":
        setSortBy("price");
        setSortOrder("DESC");
        break;
      default:
        setSortBy("createdAt");
        setSortOrder("DESC");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Decorative header accent */}
        <div className="relative mb-8">
          <div className="pointer-events-none absolute inset-x-0 -top-6 h-16 bg-gradient-to-b from-accent/15 to-transparent rounded-b-xl" />
        </div>

        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="font-sans text-3xl font-bold text-primary mb-2">
              Tin Đăng Chuyên Nghiệp
              <span className="ml-2 inline-block align-middle h-2 w-2 rounded-full bg-accent animate-pulse" />
            </h2>
            <p className="text-muted-foreground">Khám phá các dịch vụ chuyên nghiệp được xác minh trong khu vực của bạn</p>
          </div>
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <Button
                variant="outline"
                onClick={() => navigate("/login?redirect=/announcements")}
                className="border-accent text-accent hover:bg-accent/5"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập để đăng tin
              </Button>
            ) : (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground shadow-lg hover:shadow-xl transition-all rounded-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo tin đăng
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-xl">
                      <Shield className="w-5 h-5 text-accent" />
                      <span>Tạo tin đăng chuyên nghiệp</span>
                    </DialogTitle>
                    <DialogDescription>
                      Chia sẻ dịch vụ chuyên nghiệp của bạn với cộng đồng đã xác minh. Tất cả tin đăng sẽ được xem xét về chất lượng.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit(onSubmitListing)} className="grid gap-6 py-4">
                    {/* Title */}
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="text-sm font-semibold">
                        Tiêu đề <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        {...register("title")}
                        placeholder="VD: 'Luật sư kế hoạch bất động sản - Tư vấn miễn phí'"
                        className={cn("border-2", errors.title && "border-destructive")}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="grid gap-2">
                      <Label htmlFor="categoryId" className="text-sm font-semibold">
                        Thể loại dịch vụ
                      </Label>
                      <Select
                        value={watch("categoryId") || ""}
                        onValueChange={(value) => setValue("categoryId", value)}
                      >
                        <SelectTrigger className="border-2">
                          <SelectValue placeholder="Chọn thể loại dịch vụ chuyên nghiệp" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter((cat) => cat.id !== "all")
                            .map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center space-x-2">
                                  <category.icon className="w-4 h-4" />
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Content */}
                    <div className="grid gap-2">
                      <Label htmlFor="content" className="text-sm font-semibold">
                        Mô tả dịch vụ <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="content"
                        {...register("content")}
                        placeholder="Mô tả dịch vụ chuyên nghiệp, trình độ và những gì khách hàng có thể mong đợi..."
                        rows={5}
                        className={cn("border-2 resize-none", errors.content && "border-destructive")}
                      />
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          {watchedContent?.length || 0}/5000 ký tự
                        </div>
                        {errors.content && (
                          <p className="text-xs text-destructive">{errors.content.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Location and Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="location" className="text-sm font-semibold">
                          Khu vực dịch vụ
                        </Label>
                        <Input
                          id="location"
                          {...register("location")}
                          placeholder="VD: 'Trung tâm, Từ xa, Toàn quốc'"
                          className="border-2"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="price" className="text-sm font-semibold">
                          Giá
                        </Label>
                        <Input
                          id="price"
                          type="text"
                          {...register("price")}
                          placeholder="VD: '200000', '0' (liên hệ)"
                          className="border-2"
                        />
                        {errors.price && (
                          <p className="text-xs text-destructive">{errors.price.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid gap-2">
                      <Label htmlFor="contactInfo" className="text-sm font-semibold">
                        Thông tin liên hệ chuyên nghiệp <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contactInfo"
                        {...register("contactInfo")}
                        placeholder="Email hoặc số điện thoại chuyên nghiệp"
                        className={cn("border-2", errors.contactInfo && "border-destructive")}
                      />
                      {errors.contactInfo && (
                        <p className="text-sm text-destructive">{errors.contactInfo.message}</p>
                      )}
                    </div>

                    {/* Images Upload (Optional - placeholder) */}
                    <div className="grid gap-2">
                      <Label className="text-sm font-semibold">Hình ảnh chuyên nghiệp (Tùy chọn)</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-accent/50 transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Tải lên ảnh chuyên nghiệp, chứng chỉ hoặc hình ảnh văn phòng
                        </p>
                        <Button variant="outline" size="sm" className="mt-2" type="button">
                          Chọn tệp
                        </Button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col space-y-3">
                      <Alert>
                        <CheckCircle2 className="w-4 h-4" />
                        <AlertDescription className="text-xs">
                          Bằng cách đăng tin, bạn đồng ý với hướng dẫn chuyên nghiệp của chúng tôi và xác minh rằng thông tin của bạn là chính xác.
                        </AlertDescription>
                      </Alert>
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => {
                            reset();
                            setIsCreateDialogOpen(false);
                          }}
                          className="border-2"
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting || createListingMutation.isPending}
                          className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground shadow-lg"
                        >
                          {(isSubmitting || createListingMutation.isPending) ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Đang tạo...
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4 mr-2" />
                              Xuất bản tin đăng
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Login Alert for Unauthenticated Users */}
        {!isAuthenticated && (
          <Alert className="mb-8 border-accent/50 bg-accent/5">
            <Lock className="w-4 h-4 text-accent" />
            <AlertDescription>
              <span className="font-semibold">Bạn chưa đăng nhập.</span> Vui lòng{" "}
              <Link to="/login?redirect=/announcements" className="underline text-accent hover:text-accent/80">
                đăng nhập
              </Link>{" "}
              để tạo tin đăng, thích hoặc bình luận.
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm chuyên nghiệp và dịch vụ..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                      }}
                      className="pl-10 border-0 bg-muted/30 focus:bg-background transition-colors rounded-full"
                    />
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    <SelectTrigger className="w-48 border-0 bg-muted/30 rounded-full">
                      <SelectValue placeholder="Tất cả thể loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <category.icon className="w-4 h-4" />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium">Sắp xếp:</Label>
                  <Select
                    value={sortBy === "createdAt" && sortOrder === "DESC" ? "recent" : ""}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className="w-32 border-0 bg-muted/30 rounded-full">
                      <SelectValue placeholder="Mới nhất" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                      <SelectItem value="price-low">Giá: Thấp đến Cao</SelectItem>
                      <SelectItem value="price-high">Giá: Cao đến Thấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(1);
              }}
              className="transition-all inline-flex items-center rounded-full"
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.name}
              {selectedCategory === category.id && (
                <span className="ml-2 h-1 w-8 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent" />
              )}
            </Button>
          ))}
        </div>

        {/* Error State */}
        {isError && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Không thể tải tin đăng. Vui lòng thử lại sau.
              {error && <div className="text-xs mt-1">{error.message}</div>}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && <ListingCardSkeletonGrid count={9} />}

        {/* Empty State */}
        {!isLoading && !isError && listings.length === 0 && (
          <Card className="border-0 shadow-md p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Không tìm thấy tin đăng</h3>
            <p className="text-muted-foreground mb-6">
              {debouncedSearch || selectedCategory !== "all"
                ? "Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn"
                : "Chưa có tin đăng nào. Hãy là người đầu tiên tạo tin đăng!"}
            </p>
            {isAuthenticated && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-accent to-accent/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo tin đăng đầu tiên
              </Button>
            )}
          </Card>
        )}

        {/* Professional Listings Grid */}
        {!isLoading && !isError && listings.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className={cn(
                  "group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md overflow-hidden",
                  "hover:-translate-y-1 hover:border-accent/20 hover:border"
                )}
              >
                {listing.images && listing.images.length > 0 && (
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-primary shadow-sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {listing.status === "APPROVED" ? "Đã duyệt" : "Chờ duyệt"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 hidden sm:flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-white/90 text-gray-900 shadow">
                        <Eye className="w-3 h-3" />
                        {listing._count?.likes || 0}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-white/90 text-gray-900 shadow">
                        <MessageCircle className="w-3 h-3" />
                        {listing._count?.comments || 0}
                      </span>
                    </div>
                    {isNew(listing.createdAt) && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-amber-400 text-gray-900 shadow-sm">
                          Mới
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-accent/10 to-accent/5 text-accent border-accent/20"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {listing.category?.name || "Uncategorized"}
                    </Badge>
                    {isAuthenticated && user?.id === listing.authorId && (
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-accent/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement edit functionality
                            toast({
                              title: "Tính năng đang phát triển",
                              description: "Chỉnh sửa tin đăng sẽ sớm được ra mắt.",
                            });
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => handleDelete(listing.id, e)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardTitle className="font-sans text-lg group-hover:text-accent transition-colors leading-tight mb-2">
                    {listing.title}
                    {isNew(listing.createdAt) && (
                      <span className="ml-2 inline-block align-middle h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    )}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                    {listing.content}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-3">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {listing.price && listing.price > 0 && (
                        <div className="flex items-center text-sm font-semibold text-primary">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span className="text-lg">{formatPrice(listing.price)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-muted-foreground">
                          <User className="w-4 h-4 mr-1" />
                          <span className="font-medium text-foreground">
                            {listing.author?.fullName || "Anonymous"}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatRelativeDate(listing.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleLike(listing.id, e)}
                          disabled={!isAuthenticated || likeMutation.isPending}
                          className="text-muted-foreground hover:text-red-500 transition-colors h-8"
                        >
                          {likeMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Heart className="w-4 h-4 mr-1" />
                          )}
                          <span className="text-xs">{listing._count?.likes || 0}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-accent transition-colors h-8"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs">{listing._count?.comments || 0}</span>
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-accent transition-colors h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement share functionality
                          toast({
                            title: "Tính năng đang phát triển",
                            description: "Chia sẻ sẽ sớm được ra mắt.",
                          });
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground shadow-md hover:shadow-lg transition-all rounded-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Đặt lịch hẹn & Gửi hồ sơ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More / Pagination */}
        {!isLoading && !isError && listings.length > 0 && (
          <div className="text-center mt-12">
            {hasMore ? (
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="border-2 border-accent/20 hover:border-accent hover:bg-accent/5 rounded-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  "Tải thêm tin đăng"
                )}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">Đã hiển thị tất cả tin đăng</p>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              Hiển thị {listings.length} trong {totalItems} tin đăng chuyên nghiệp
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
