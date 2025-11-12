# API Integration Guide - User Frontend

## Overview

This document describes the API service layer integration between the user-frontend and backend API.

**Backend API:** `http://localhost:8830/api`
**Status:** ✅ Fully integrated and ready to use

---

## 📁 Service Files Created

All service files are located in `src/services/`:

1. **`api.client.ts`** - Axios instance with authentication interceptors
2. **`auth.service.ts`** - Authentication (login, register, password management)
3. **`services.service.ts`** - Notary services catalog
4. **`fee-calculations.service.ts`** - Fee calculator
5. **`consultations.service.ts`** - Consultation booking
6. **`articles.service.ts`** - News and articles
7. **`listings.service.ts`** - Property listings
8. **`index.ts`** - Central export point

---

## 🔐 Authentication Service

### Location: `src/services/auth.service.ts`

### Features:
- JWT token management (access & refresh tokens)
- Automatic token refresh on 401 errors
- Login, register, change password, logout
- Token stored in localStorage
- Axios interceptors for automatic auth headers

### Usage Example:

```typescript
import { authService, useAuth } from '@/services';

// In a component with AuthContext
const { login, register, logout, user, isAuthenticated } = useAuth();

// Login
try {
  await login({ email: 'user@example.com', password: 'password123' });
  // User is now authenticated, navigate to dashboard
} catch (error) {
  // Handle login error
}

// Register
try {
  await register({
    email: 'newuser@example.com',
    password: 'password123',
    fullName: 'John Doe',
    phone: '0123456789',
  });
  // User is registered and auto-logged in
} catch (error) {
  // Handle registration error
}

// Logout
logout(); // Clears tokens and redirects to login

// Check authentication
if (isAuthenticated) {
  console.log('User:', user);
}
```

### Authentication Context

**Location:** `src/contexts/AuthContext.tsx`

Provides global authentication state management.

**Setup:** Wrap your app with `AuthProvider`:

```typescript
// In App.tsx or main.tsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

---

## 🏢 Services API

### Location: `src/services/services.service.ts`

### Available Methods:

```typescript
import { servicesService } from '@/services';

// Get all active services (paginated)
const response = await servicesService.getActiveServices({
  page: 1,
  limit: 10,
  search: 'công chứng',
});

// Get service by ID
const service = await servicesService.getById('service-id');

// Response structure:
{
  statusCode: 200,
  message: "Success",
  data: {
    items: [
      {
        id: "uuid",
        name: "Công chứng hợp đồng",
        slug: "cong-chung-hop-dong",
        description: "Dịch vụ công chứng hợp đồng",
        price: 500000,
        status: true,
        createdAt: "2025-11-11T...",
        updatedAt: "2025-11-11T..."
      }
    ],
    total: 20,
    page: 1,
    limit: 10
  }
}
```

---

## 💰 Fee Calculator API

### Location: `src/services/fee-calculations.service.ts`

### Available Methods:

```typescript
import { feeCalculationsService } from '@/services';

// Get document groups (types of documents)
const documentGroups = await feeCalculationsService.getDocumentGroups();

// Get fee types for a document group
const feeTypes = await feeCalculationsService.getFeeTypes('document-group-id');

// Calculate fee (works for guest and authenticated users)
const result = await feeCalculationsService.calculate({
  documentGroupId: 'document-group-id',
  feeTypeId: 'fee-type-id',
  inputData: {
    property_value: 5000000000, // 5 billion VND
    property_type: 'Nhà và đất',
    area: 100,
    num_parties: 2,
    num_copies: 3,
  },
});

// Get user's calculation history (authenticated only)
const history = await feeCalculationsService.getMyCalculations({
  page: 1,
  limit: 10,
});

// Response structure:
{
  statusCode: 201,
  message: "Fee calculated successfully",
  data: {
    id: "calculation-id",
    documentGroupId: "...",
    feeTypeId: "...",
    inputData: { ... },
    calculationResult: {
      baseFee: 75000000,
      additionalFees: [
        {
          name: "Phí bản sao",
          amount: 150000,
          description: "50,000đ mỗi bản sao × 3"
        }
      ],
      totalFee: 75150000,
      breakdown: "..."
    },
    totalFee: 75150000,
    createdAt: "2025-11-11T..."
  }
}
```

---

## 📅 Consultations API

### Location: `src/services/consultations.service.ts`

### Available Methods:

```typescript
import { consultationsService } from '@/services';

// Create consultation booking (authenticated only)
const consultation = await consultationsService.create({
  requestedDatetime: '2025-11-15T10:00:00Z',
  content: 'Tôi cần tư vấn về công chứng hợp đồng mua bán nhà',
  serviceId: 'service-id', // Optional
});

// Get user's consultations
const myConsultations = await consultationsService.getMyConsultations({
  page: 1,
  limit: 10,
  status: 'PENDING',
});

// Get consultation by ID
const detail = await consultationsService.getById('consultation-id');

// Cancel consultation
await consultationsService.cancel('consultation-id', 'Tôi có việc bận đột xuất');

// Response structure:
{
  statusCode: 201,
  message: "Lịch tư vấn đã được tạo thành công",
  data: {
    id: "consultation-id",
    customerId: "user-id",
    customer: {
      id: "...",
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0123456789"
    },
    staffId: null,
    serviceId: "service-id",
    service: { ... },
    requestedDatetime: "2025-11-15T10:00:00Z",
    content: "...",
    status: "PENDING",
    createdAt: "2025-11-11T..."
  }
}
```

### Consultation Status Flow:
- **PENDING** → Initial status when customer creates booking
- **APPROVED** → Staff/Admin approved and assigned staff
- **COMPLETED** → Consultation finished
- **CANCELLED** → Cancelled by customer or staff

---

## 📰 Articles API

### Location: `src/services/articles.service.ts`

### Available Methods:

```typescript
import { articlesService } from '@/services';

// Get published articles (public)
const articles = await articlesService.getAll({
  page: 1,
  limit: 10,
  search: 'công chứng',
  type: 'NEWS', // NEWS, SHARE, or omit for all
});

// Get news articles
const news = await articlesService.getNews({ page: 1, limit: 5 });

// Get share articles
const shares = await articlesService.getShares({ page: 1, limit: 5 });

// Get latest articles
const latest = await articlesService.getLatest(5);

// Get article by ID
const article = await articlesService.getById('article-id');

// Get article by slug (SEO-friendly)
const article = await articlesService.getBySlug('cong-chung-hop-dong-mua-ban-nha');

// Get related articles
const related = await articlesService.getRelated('category-id', 'current-article-id', 4);

// Response structure:
{
  statusCode: 200,
  message: "Danh sách bài viết",
  data: {
    items: [
      {
        id: "article-id",
        title: "Hướng dẫn công chứng hợp đồng",
        slug: "huong-dan-cong-chung-hop-dong",
        content: "<p>Nội dung bài viết...</p>",
        excerpt: "Tóm tắt ngắn...",
        authorId: "...",
        author: {
          id: "...",
          fullName: "Admin"
        },
        categoryId: "...",
        category: {
          id: "...",
          name: "Tin tức",
          slug: "tin-tuc"
        },
        status: "PUBLISHED",
        type: "NEWS",
        isCrawled: false,
        publishedAt: "2025-11-10T...",
        createdAt: "2025-11-10T..."
      }
    ],
    total: 50,
    page: 1,
    limit: 10
  }
}
```

---

## 🏠 Listings API

### Location: `src/services/listings.service.ts`

### Available Methods:

```typescript
import { listingsService } from '@/services';

// Get approved listings (public)
const listings = await listingsService.getAll({
  page: 1,
  limit: 12,
  search: 'nhà đất',
  categoryId: 'category-id',
  minPrice: 1000000000,
  maxPrice: 5000000000,
  sortBy: 'price',
  sortOrder: 'ASC',
});

// Get listing by ID
const listing = await listingsService.getById('listing-id');

// Create listing (authenticated only)
const newListing = await listingsService.create({
  title: 'Bán nhà 3 tầng đường Lê Lợi',
  content: 'Mô tả chi tiết...',
  price: 3500000000,
  categoryId: 'category-id',
  images: ['image1.jpg', 'image2.jpg'],
});

// Update listing (author only)
await listingsService.update('listing-id', {
  price: 3200000000,
});

// Delete listing
await listingsService.delete('listing-id');

// Get user's listings
const myListings = await listingsService.getMyListings({ page: 1, limit: 10 });

// Add comment
await listingsService.addComment('listing-id', 'Nhà đẹp quá!');

// Get comments
const comments = await listingsService.getComments('listing-id');

// Like listing
await listingsService.like('listing-id');

// Unlike listing
await listingsService.unlike('listing-id');

// Check if liked
const { data } = await listingsService.checkLiked('listing-id');
console.log(data.liked); // true or false
```

---

## 🔄 API Client Configuration

### Location: `src/services/api.client.ts`

### Features:

1. **Automatic Authentication**
   - Adds JWT access token to all requests
   - Handles 401 errors with automatic token refresh
   - Clears tokens and redirects to login if refresh fails

2. **Token Management**
   ```typescript
   import { tokenManager } from '@/services';

   // Set tokens
   tokenManager.setTokens(accessToken, refreshToken);

   // Get tokens
   const accessToken = tokenManager.getAccessToken();
   const refreshToken = tokenManager.getRefreshToken();

   // Clear tokens
   tokenManager.clearTokens();

   // Check authentication
   const isAuth = tokenManager.isAuthenticated();
   ```

3. **Error Handling**
   - Automatically retries failed requests after token refresh
   - Provides consistent error responses
   - Handles network errors gracefully

---

## 🎯 Next Steps for Page Integration

### Priority 1: Authentication Pages

1. **Update Login Page** (`src/pages/Login.tsx`)
   ```typescript
   import { useAuth } from '@/contexts/AuthContext';

   const { login, isLoading } = useAuth();

   const handleSubmit = async (e) => {
     try {
       await login({ email, password });
       navigate('/dashboard');
     } catch (error) {
       // Show error message
     }
   };
   ```

2. **Update Register Page** (`src/pages/Register.tsx`)
   ```typescript
   import { useAuth } from '@/contexts/AuthContext';

   const { register } = useAuth();

   const handleSubmit = async (data) => {
     try {
       await register(data);
       navigate('/dashboard');
     } catch (error) {
       // Show error message
     }
   };
   ```

### Priority 2: Services Pages

3. **Update Services Page** (`src/pages/Services.tsx`)
   ```typescript
   import { servicesService } from '@/services';

   const [services, setServices] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     const fetchServices = async () => {
       try {
         const response = await servicesService.getActiveServices();
         setServices(response.data.items);
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     };
     fetchServices();
   }, []);
   ```

### Priority 3: News/Articles Pages

4. **Update News Page** (`src/pages/News.tsx`)
   ```typescript
   import { articlesService } from '@/services';

   const { data, isLoading } = useQuery({
     queryKey: ['articles', 'news'],
     queryFn: () => articlesService.getNews({ limit: 10 }),
   });
   ```

5. **Update NewsDetail Page** (`src/pages/NewsDetail.tsx`)
   ```typescript
   import { articlesService } from '@/services';

   const { slug } = useParams();
   const { data } = useQuery({
     queryKey: ['article', slug],
     queryFn: () => articlesService.getBySlug(slug),
   });
   ```

### Priority 4: New Pages

6. **Create Fee Calculator Page**
7. **Create Consultation Booking Page**
8. **Update Dashboard with consultation status**

---

## 🧪 Testing

### Manual Testing Checklist:

- [ ] Login with valid credentials
- [ ] Register new user
- [ ] Token auto-refresh on expiry
- [ ] Logout clears tokens
- [ ] Browse services catalog
- [ ] Calculate fees (guest)
- [ ] Calculate fees (authenticated)
- [ ] View calculation history
- [ ] Create consultation booking
- [ ] View my consultations
- [ ] Browse news articles
- [ ] View article detail by slug
- [ ] Browse property listings
- [ ] Like/unlike listing
- [ ] Add comment to listing

### Test with Backend Running:

```bash
# Ensure backend is running
cd apps/backend
yarn dev  # Should be on port 8830

# Ensure user-frontend is running
cd apps/user-frontend
yarn dev  # Should be on port 3005

# Test API connectivity
curl http://localhost:8830/api
# Should return: "Vinh Xuan CMS API is running! 🚀"
```

---

## 📝 Notes

1. **Authentication State**
   - All pages should use `useAuth()` hook for authentication
   - Protected routes should check `isAuthenticated`
   - User info available in `user` object

2. **Error Handling**
   - All service methods throw errors on failure
   - Use try-catch blocks in components
   - Display user-friendly error messages

3. **Loading States**
   - Services are async, always handle loading states
   - Use React Query for better data management
   - Show loading indicators to users

4. **TypeScript**
   - All services have full TypeScript types
   - Import types from service files
   - Use types for better IDE support

5. **Performance**
   - Use React Query for caching and data synchronization
   - Implement pagination for large lists
   - Lazy load components when needed

---

## 🚀 Ready to Use!

The API service layer is fully integrated and ready to use. All services are properly typed, have error handling, and automatic authentication management.

**Next:** Update existing pages to consume these APIs and create new pages for fee calculator and consultation booking.
