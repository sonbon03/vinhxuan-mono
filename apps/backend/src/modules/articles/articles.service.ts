import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus, ArticleType } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { UserRole } from 'src/common/enums';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto, authorId: string): Promise<Article> {
    // Check slug uniqueness
    const existingArticle = await this.articleRepository.findOne({
      where: { slug: createArticleDto.slug },
    });

    if (existingArticle) {
      throw new ConflictException('Slug đã tồn tại');
    }

    const article = this.articleRepository.create({
      ...createArticleDto,
      authorId,
      status: ArticleStatus.DRAFT, // Always create as DRAFT
    });

    return await this.articleRepository.save(article);
  }

  async findAll(queryDto: QueryArticlesDto, userRole?: UserRole) {
    const {
      page = 1,
      limit = 20,
      search,
      authorId,
      categoryId,
      status,
      type,
      isCrawled,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.approver', 'approver');

    // Public users can only see PUBLISHED articles (not HIDDEN or INTERNAL)
    if (!userRole || userRole === UserRole.CUSTOMER) {
      query.andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED });
      query.andWhere('article.type != :internalType', { internalType: ArticleType.INTERNAL });
    }

    // Apply filters
    if (search) {
      query.andWhere('article.title ILIKE :search', { search: `%${search}%` });
    }

    if (authorId) {
      query.andWhere('article.authorId = :authorId', { authorId });
    }

    if (categoryId) {
      query.andWhere('article.categoryId = :categoryId', { categoryId });
    }

    if (status) {
      query.andWhere('article.status = :status', { status });
    }

    if (type) {
      query.andWhere('article.type = :type', { type });
    }

    if (isCrawled !== undefined) {
      query.andWhere('article.isCrawled = :isCrawled', { isCrawled });
    }

    // Sorting
    query.orderBy(`article.${sortBy}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userRole?: UserRole): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'approver'],
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Public users can only see PUBLISHED articles
    if (!userRole || userRole === UserRole.CUSTOMER) {
      if (article.status !== ArticleStatus.PUBLISHED || article.type === ArticleType.INTERNAL) {
        throw new ForbiddenException('Bạn không có quyền xem bài viết này');
      }
    }

    return article;
  }

  async findBySlug(slug: string, userRole?: UserRole): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'category', 'approver'],
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Public users can only see PUBLISHED articles
    if (!userRole || userRole === UserRole.CUSTOMER) {
      if (article.status !== ArticleStatus.PUBLISHED || article.type === ArticleType.INTERNAL) {
        throw new ForbiddenException('Bạn không có quyền xem bài viết này');
      }
    }

    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Staff can only edit their own DRAFT articles
    if (userRole === UserRole.STAFF) {
      if (article.authorId !== userId) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này');
      }
      if (article.status !== ArticleStatus.DRAFT) {
        throw new ForbiddenException('Chỉ có thể chỉnh sửa bài viết ở trạng thái DRAFT');
      }
      // Staff cannot change status
      delete updateArticleDto.status;
    }

    // Check slug uniqueness if changing slug
    if (updateArticleDto.slug && updateArticleDto.slug !== article.slug) {
      const existingArticle = await this.articleRepository.findOne({
        where: { slug: updateArticleDto.slug },
      });

      if (existingArticle) {
        throw new ConflictException('Slug đã tồn tại');
      }
    }

    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Staff can only delete their own DRAFT articles
    if (userRole === UserRole.STAFF) {
      if (article.authorId !== userId) {
        throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
      }
      if (article.status !== ArticleStatus.DRAFT) {
        throw new ForbiddenException('Chỉ có thể xóa bài viết ở trạng thái DRAFT');
      }
    }

    await this.articleRepository.remove(article);
  }

  async publish(id: string, approverId: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    article.status = ArticleStatus.PUBLISHED;
    article.approverId = approverId;
    article.publishedAt = new Date();

    return await this.articleRepository.save(article);
  }

  async archive(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    article.status = ArticleStatus.ARCHIVED;
    return await this.articleRepository.save(article);
  }

  async toggleHidden(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    if (article.status === ArticleStatus.HIDDEN) {
      article.status = ArticleStatus.PUBLISHED;
    } else if (article.status === ArticleStatus.PUBLISHED) {
      article.status = ArticleStatus.HIDDEN;
    } else {
      throw new ForbiddenException('Chỉ có thể ẩn/hiện bài viết ở trạng thái PUBLISHED');
    }

    return await this.articleRepository.save(article);
  }

  async seedFakeArticles(adminId: string) {
    const fakeArticles = [
      {
        title: 'Hướng dẫn làm hợp đồng mua bán nhà đất năm 2025',
        slug: 'huong-dan-lam-hop-dong-mua-ban-nha-dat-2025',
        content: '<h2>Giới thiệu</h2><p>Trong bài viết này, chúng tôi sẽ hướng dẫn chi tiết cách làm hợp đồng mua bán nhà đất theo quy định mới nhất năm 2025. Hợp đồng mua bán nhà đất là văn bản pháp lý quan trọng, đảm bảo quyền lợi cho cả người mua và người bán.</p><h2>Các bước thực hiện</h2><p>Bước 1: Chuẩn bị hồ sơ pháp lý...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      },
      {
        title: 'Quy định mới về công chứng hợp đồng chuyển nhượng quyền sử dụng đất',
        slug: 'quy-dinh-moi-ve-cong-chung-hop-dong-chuyen-nhuong-quyen-su-dung-dat',
        content: '<h2>Tổng quan</h2><p>Bộ Tư pháp vừa ban hành quy định mới về công chứng hợp đồng chuyển nhượng quyền sử dụng đất, có hiệu lực từ ngày 01/01/2025.</p><h2>Những thay đổi quan trọng</h2><p>1. Thủ tục đơn giản hơn...<br>2. Phí công chứng được điều chỉnh...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
      },
      {
        title: 'Thủ tục công chứng hợp đồng tặng cho tài sản',
        slug: 'thu-tuc-cong-chung-hop-dong-tang-cho-tai-san',
        content: '<h2>Hợp đồng tặng cho là gì?</h2><p>Hợp đồng tặng cho là văn bản thỏa thuận giữa bên tặng và bên nhận tặng về việc chuyển giao quyền sở hữu, quyền sử dụng tài sản không có điều kiện.</p><h2>Hồ sơ cần thiết</h2><p>- Giấy tờ tùy thân<br>- Giấy chứng nhận quyền sở hữu<br>- Đơn đề nghị công chứng...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      },
      {
        title: 'Kinh nghiệm mua bán căn hộ chung cư an toàn',
        slug: 'kinh-nghiem-mua-ban-can-ho-chung-cu-an-toan',
        content: '<h2>Lưu ý khi mua căn hộ chung cư</h2><p>Việc mua bán căn hộ chung cư cần được thực hiện cẩn thận để tránh rủi ro pháp lý. Dưới đây là những kinh nghiệm quan trọng từ các chuyên gia.</p><h2>Kiểm tra pháp lý</h2><p>1. Kiểm tra sổ hồng<br>2. Xác minh chủ sở hữu<br>3. Kiểm tra tình trạng tranh chấp...</p>',
        type: ArticleType.SHARE,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      },
      {
        title: 'Phân biệt hợp đồng mua bán và hợp đồng góp vốn',
        slug: 'phan-biet-hop-dong-mua-ban-va-hop-dong-gop-von',
        content: '<h2>Khái niệm</h2><p>Hợp đồng mua bán và hợp đồng góp vốn là hai loại hợp đồng khác nhau về bản chất pháp lý và mục đích sử dụng.</p><h2>Điểm khác biệt</h2><p>Hợp đồng mua bán: Chuyển giao quyền sở hữu hoàn toàn...<br>Hợp đồng góp vốn: Giữ quyền sở hữu, nhận cổ phần...</p>',
        type: ArticleType.SHARE,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      },
      {
        title: 'Cập nhật biểu phí công chứng mới nhất 2025',
        slug: 'cap-nhat-bieu-phi-cong-chung-moi-nhat-2025',
        content: '<h2>Biểu phí công chứng 2025</h2><p>Bộ Tư pháp đã ban hành biểu phí công chứng mới, áp dụng từ ngày 01/01/2025 với nhiều thay đổi quan trọng.</p><h2>Chi tiết mức phí</h2><p>- Hợp đồng mua bán nhà đất: 0.5% giá trị tài sản<br>- Hợp đồng chuyển nhượng: 0.3% giá trị<br>- Hợp đồng tặng cho: 0.2% giá trị...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=800',
      },
      {
        title: 'Hướng dẫn làm giấy ủy quyền công chứng',
        slug: 'huong-dan-lam-giay-uy-quyen-cong-chung',
        content: '<h2>Giấy ủy quyền là gì?</h2><p>Giấy ủy quyền là văn bản pháp lý mà người ủy quyền giao cho người được ủy quyền thực hiện một hoặc một số công việc nhất định thay mặt mình.</p><h2>Thủ tục công chứng</h2><p>Bước 1: Soạn thảo giấy ủy quyền<br>Bước 2: Mang hồ sơ đến văn phòng công chứng...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      },
      {
        title: 'Thủ tục công chứng hợp đồng thế chấp',
        slug: 'thu-tuc-cong-chung-hop-dong-the-chap',
        content: '<h2>Hợp đồng thế chấp</h2><p>Hợp đồng thế chấp tài sản là hợp đồng giữa bên thế chấp và bên nhận thế chấp, theo đó bên thế chấp dùng tài sản thuộc sở hữu của mình để bảo đảm thực hiện nghĩa vụ đối với bên nhận thế chấp.</p><h2>Hồ sơ yêu cầu</h2><p>- Hợp đồng vay<br>- Giấy chứng nhận quyền sở hữu<br>- CMND/CCCD...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800',
      },
      {
        title: 'Chia sẻ kinh nghiệm xử lý tranh chấp đất đai',
        slug: 'chia-se-kinh-nghiem-xu-ly-tranh-chap-dat-dai',
        content: '<h2>Các loại tranh chấp thường gặp</h2><p>Tranh chấp đất đai là vấn đề phức tạp, thường xảy ra trong quá trình mua bán, chuyển nhượng hoặc thừa kế.</p><h2>Cách giải quyết</h2><p>1. Thương lượng hòa giải<br>2. Khởi kiện tại tòa án<br>3. Tìm kiếm hỗ trợ pháp lý chuyên nghiệp...</p>',
        type: ArticleType.SHARE,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
      },
      {
        title: 'Quy trình công chứng di sản thừa kế',
        slug: 'quy-trinh-cong-chung-di-san-thua-ke',
        content: '<h2>Di sản thừa kế</h2><p>Di sản thừa kế là tài sản của người đã chết để lại, bao gồm tài sản riêng và phần tài sản chung trong trường hợp có phân chia.</p><h2>Các bước thực hiện</h2><p>Bước 1: Xác định danh sách người thừa kế<br>Bước 2: Lập văn bản phân chia di sản<br>Bước 3: Công chứng văn bản...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
      },
      {
        title: 'Những lưu ý khi ký hợp đồng mua bán xe ô tô',
        slug: 'nhung-luu-y-khi-ky-hop-dong-mua-ban-xe-o-to',
        content: '<h2>Kiểm tra thông tin xe</h2><p>Trước khi ký hợp đồng mua bán xe ô tô, người mua cần kiểm tra kỹ lưỡng thông tin về xe và chủ sở hữu.</p><h2>Hợp đồng mua bán xe</h2><p>- Thông tin đầy đủ về xe<br>- Giá trị giao dịch<br>- Phương thức thanh toán<br>- Cam kết của hai bên...</p>',
        type: ArticleType.SHARE,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      },
      {
        title: 'Hướng dẫn làm hợp đồng thuê nhà an toàn',
        slug: 'huong-dan-lam-hop-dong-thue-nha-an-toan',
        content: '<h2>Hợp đồng thuê nhà</h2><p>Hợp đồng thuê nhà là văn bản thỏa thuận giữa bên cho thuê và bên thuê về việc sử dụng nhà trong một thời gian nhất định với mức giá thỏa thuận.</p><h2>Nội dung cần có</h2><p>1. Thông tin hai bên<br>2. Thông tin nhà cho thuê<br>3. Thời hạn thuê<br>4. Giá thuê và phương thức thanh toán...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
      },
      {
        title: 'Tư vấn về hợp đồng đặt cọc mua nhà',
        slug: 'tu-van-ve-hop-dong-dat-coc-mua-nha',
        content: '<h2>Hợp đồng đặt cọc</h2><p>Hợp đồng đặt cọc là văn bản thỏa thuận sơ bộ giữa người mua và người bán về việc đặt cọc một khoản tiền để đảm bảo giao dịch mua bán được thực hiện.</p><h2>Quyền và nghĩa vụ</h2><p>- Bên đặt cọc: Có quyền mua nhà theo thỏa thuận...<br>- Bên nhận cọc: Phải bán nhà cho người đặt cọc...</p>',
        type: ArticleType.SHARE,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800',
      },
      {
        title: 'Thay đổi trong quy định về hợp đồng kinh tế',
        slug: 'thay-doi-trong-quy-dinh-ve-hop-dong-kinh-te',
        content: '<h2>Quy định mới</h2><p>Luật Doanh nghiệp sửa đổi 2024 có nhiều thay đổi về hợp đồng kinh tế, ảnh hưởng đến hoạt động của doanh nghiệp.</p><h2>Điểm mới nổi bật</h2><p>1. Đơn giản hóa thủ tục<br>2. Bổ sung các điều khoản bắt buộc<br>3. Tăng cường bảo vệ quyền lợi doanh nghiệp nhỏ...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: true,
        sourceUrl: 'https://baophapluat.vn/hop-dong-kinh-te-2024',
      },
      {
        title: 'Công chứng hợp đồng chia tách tài sản',
        slug: 'cong-chung-hop-dong-chia-tach-tai-san',
        content: '<h2>Chia tách tài sản</h2><p>Chia tách tài sản là việc phân chia tài sản chung của nhiều người theo tỷ lệ phần sở hữu hoặc theo thỏa thuận.</p><h2>Quy trình thực hiện</h2><p>Bước 1: Thống nhất phương án chia tách<br>Bước 2: Lập văn bản chia tách<br>Bước 3: Công chứng và đăng ký...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      },
      {
        title: 'Kinh nghiệm đầu tư bất động sản năm 2025',
        slug: 'kinh-nghiem-dau-tu-bat-dong-san-nam-2025',
        content: '<h2>Xu hướng thị trường</h2><p>Thị trường bất động sản năm 2025 dự báo sẽ có nhiều biến động. Các nhà đầu tư cần cân nhắc kỹ lưỡng trước khi quyết định.</p><h2>Lời khuyên từ chuyên gia</h2><p>1. Nghiên cứu kỹ thị trường<br>2. Kiểm tra pháp lý cẩn thận<br>3. Đa dạng hóa danh mục đầu tư...</p>',
        type: ArticleType.SHARE,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      },
      {
        title: 'Hướng dẫn công chứng hợp đồng mua bán cổ phần',
        slug: 'huong-dan-cong-chung-hop-dong-mua-ban-co-phan',
        content: '<h2>Hợp đồng mua bán cổ phần</h2><p>Hợp đồng mua bán cổ phần là văn bản thỏa thuận giữa cổ đông chuyển nhượng và người mua về việc chuyển nhượng cổ phần trong công ty.</p><h2>Điều kiện công chứng</h2><p>- Cổ phần phải được chuyển nhượng hợp pháp<br>- Có sự đồng ý của công ty (nếu cần)<br>- Hồ sơ pháp lý đầy đủ...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
      },
      {
        title: 'Những sai lầm thường gặp khi làm hợp đồng',
        slug: 'nhung-sai-lam-thuong-gap-khi-lam-hop-dong',
        content: '<h2>Sai lầm phổ biến</h2><p>Nhiều người vì thiếu kinh nghiệm đã mắc phải các sai lầm khi ký kết hợp đồng, dẫn đến tranh chấp và tổn thất tài chính.</p><h2>Cách phòng tránh</h2><p>1. Đọc kỹ điều khoản hợp đồng<br>2. Tham khảo ý kiến luật sư<br>3. Kiểm tra pháp lý đầy đủ<br>4. Công chứng để đảm bảo hiệu lực...</p>',
        type: ArticleType.SHARE,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      },
      {
        title: 'Quy định mới về chữ ký số trong công chứng',
        slug: 'quy-dinh-moi-ve-chu-ky-so-trong-cong-chung',
        content: '<h2>Chữ ký số và công chứng điện tử</h2><p>Nghị định mới về chữ ký số đã mở ra khả năng công chứng trực tuyến, giúp tiết kiệm thời gian và chi phí cho người dân.</p><h2>Lợi ích</h2><p>- Tiết kiệm thời gian<br>- Giảm chi phí đi lại<br>- Tăng tính bảo mật<br>- Lưu trữ điện tử an toàn...</p>',
        type: ArticleType.NEWS,
        status: ArticleStatus.PUBLISHED,
        isCrawled: true,
        sourceUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
      },
      {
        title: 'Tư vấn pháp lý về hợp đồng xây dựng',
        slug: 'tu-van-phap-ly-ve-hop-dong-xay-dung',
        content: '<h2>Hợp đồng xây dựng</h2><p>Hợp đồng xây dựng là văn bản thỏa thuận giữa chủ đầu tư và nhà thầu về việc thực hiện công trình xây dựng.</p><h2>Các điều khoản quan trọng</h2><p>1. Phạm vi công việc<br>2. Thời gian thực hiện<br>3. Giá trị hợp đồng<br>4. Phương thức thanh toán<br>5. Bảo hành công trình...</p>',
        type: ArticleType.SHARE,
        status: ArticleStatus.PUBLISHED,
        isCrawled: false,
        sourceUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
      },
    ];

    const createdArticles = [];

    for (const articleData of fakeArticles) {
      try {
        // Check if slug already exists
        const existing = await this.articleRepository.findOne({
          where: { slug: articleData.slug },
        });

        if (!existing) {
          const article = this.articleRepository.create({
            ...articleData,
            authorId: adminId,
            approverId: adminId,
            publishedAt: new Date(),
          });

          const saved = await this.articleRepository.save(article);
          createdArticles.push(saved);
        }
      } catch (error) {
        // Continue on error
        console.error(`Error creating article: ${articleData.title}`, error);
      }
    }

    return {
      count: createdArticles.length,
      articles: createdArticles,
    };
  }
}
