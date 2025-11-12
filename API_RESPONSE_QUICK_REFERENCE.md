# API Response Structure - Quick Reference

## Backend Response Format

All API endpoints return responses wrapped in a standard format:

```typescript
{
  statusCode: number,    // HTTP status code (200, 201, 400, etc.)
  message: string,       // Human-readable message
  data: T                // Actual response data
}
```

## Frontend Handling

The axios interceptor **automatically unwraps** responses, so services receive the `data` property directly.

## Common Response Types

### 1. Single Item Response

**Backend returns:**
```json
{
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

**Frontend receives (after unwrapping):**
```typescript
{
  id: "uuid",
  fullName: "John Doe",
  email: "john@example.com",
  ...
}
```

**Service implementation:**
```typescript
getUserById: async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data; // Already unwrapped by interceptor
}
```

### 2. Paginated Response

**Backend returns:**
```json
{
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

**Frontend receives (after unwrapping):**
```typescript
{
  items: [...],
  total: 100,
  page: 1,
  limit: 20,
  totalPages: 5
}
```

**Service implementation:**
```typescript
import type { PaginatedData } from '../types/api.types';

getUsers: async (params): Promise<PaginatedData<User>> => {
  const response = await api.get<PaginatedData<User>>('/users', { params });
  return response.data; // Already unwrapped by interceptor
}
```

### 3. Create/Update Response

**Backend returns:**
```json
{
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "id": "new-uuid",
    "fullName": "Jane Doe",
    ...
  }
}
```

**Frontend receives:**
```typescript
{
  id: "new-uuid",
  fullName: "Jane Doe",
  ...
}
```

**Service implementation:**
```typescript
createUser: async (data: CreateUserDto): Promise<User> => {
  const response = await api.post<User>('/users', data);
  return response.data;
}
```

### 4. Delete/Void Response

**Backend returns:**
```json
{
  "statusCode": 204,
  "message": "User deleted successfully",
  "data": null
}
```

**Service implementation:**
```typescript
deleteUser: async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
  // No return value needed
}
```

## Using in Components

### With Paginated Data

```typescript
import { userService } from '@/services/user.service';
import type { PaginatedData } from '@/types/api.types';

const [data, setData] = useState<PaginatedData<User> | null>(null);

const loadUsers = async () => {
  const result = await userService.getUsers({ page: 1, limit: 20 });
  setData(result);

  // Access properties directly
  console.log(result.items);      // Array of users
  console.log(result.total);      // Total count
  console.log(result.page);       // Current page
  console.log(result.totalPages); // Total pages
};
```

### With React Query

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['users', params],
  queryFn: () => userService.getUsers(params),
});

// data has type PaginatedData<User>
if (data) {
  console.log(data.items);
  console.log(data.total);
}
```

### With Ant Design ProTable

```typescript
<ProTable
  request={async (params) => {
    const result = await userService.getUsers(params);
    return {
      data: result.items,
      total: result.total,
      success: true,
    };
  }}
/>
```

## Error Handling

Errors are **not** unwrapped - they remain as axios errors:

```typescript
try {
  const user = await userService.getUserById(id);
} catch (error) {
  if (axios.isAxiosError(error)) {
    // error.response.data contains the backend error response
    const { message } = error.response?.data || {};
    console.error(message);
  }
}
```

**Backend error format:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "data": {
    "errors": ["email must be a valid email"]
  }
}
```

## Creating New Services

### Template for New Service File

```typescript
import api from './api';
import type { PaginatedData } from '../types/api.types';

// Define your entity interface
export interface MyEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define DTOs
export interface CreateMyEntityDto {
  name: string;
}

export interface UpdateMyEntityDto {
  name?: string;
}

export interface QueryMyEntitiesParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Export service
export const myEntityService = {
  // Get paginated list
  getAll: async (params: QueryMyEntitiesParams): Promise<PaginatedData<MyEntity>> => {
    const response = await api.get<PaginatedData<MyEntity>>('/my-entities', { params });
    return response.data;
  },

  // Get single item
  getById: async (id: string): Promise<MyEntity> => {
    const response = await api.get<MyEntity>(`/my-entities/${id}`);
    return response.data;
  },

  // Create
  create: async (data: CreateMyEntityDto): Promise<MyEntity> => {
    const response = await api.post<MyEntity>('/my-entities', data);
    return response.data;
  },

  // Update
  update: async (id: string, data: UpdateMyEntityDto): Promise<MyEntity> => {
    const response = await api.put<MyEntity>(`/my-entities/${id}`, data);
    return response.data;
  },

  // Delete
  delete: async (id: string): Promise<void> => {
    await api.delete(`/my-entities/${id}`);
  },
};
```

## Key Points

✅ **Always import `PaginatedData`** from `'../types/api.types'`
✅ **Don't define local `PaginatedResponse`** - use the centralized type
✅ **Return `response.data`** - the interceptor has already unwrapped it
✅ **Use TypeScript generics** - `api.get<T>()` for type safety
✅ **Handle errors** - they are not unwrapped, use axios error handling

❌ **Don't access `response.data.data`** - it's already unwrapped
❌ **Don't define custom pagination interfaces** - use `PaginatedData<T>`
❌ **Don't manually unwrap responses** - the interceptor handles it
