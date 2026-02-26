# Axios API Client

A production-ready axios instance with interceptors, error handling, and type safety for the ORX Core platform.

## Features

- ✅ Pre-configured axios instance with sensible defaults
- ✅ Request/response interceptors for auth tokens and error handling
- ✅ Automatic correlation ID generation for request tracking
- ✅ Normalized error handling with consistent ApiError structure
- ✅ Type-safe HTTP method wrappers
- ✅ Configurable callbacks for auth and error scenarios
- ✅ SSR-safe (Next.js compatible)

## Basic Usage

### Using the Default Instance

```typescript
import { apiClient } from '@optum-rx-core/orx-core-client-shared';

// Direct axios usage
const response = await apiClient.get('/users');
const users = response.data;

// With type safety
interface User {
  id: string;
  name: string;
}

const response = await apiClient.get<User[]>('/users');
const users = response.data; // Type: User[]
```

### Using Type-Safe Wrappers

```typescript
import { get, post, put, patch, del } from '@optum-rx-core/orx-core-client-shared';

// GET request
const users = await get<User[]>('/users');

// POST request
const newUser = await post<User, CreateUserDto>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// PUT request
const updatedUser = await put<User, UpdateUserDto>(`/users/${id}`, {
  name: 'Jane Doe',
});

// PATCH request
const patchedUser = await patch<User, Partial<User>>(`/users/${id}`, {
  name: 'Jane Smith',
});

// DELETE request
await del(`/users/${id}`);
```

## Creating Custom Instances

For different API endpoints or configurations:

```typescript
import { createApiClient } from '@optum-rx-core/orx-core-client-shared';

const customClient = createApiClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'X-Custom-Header': 'value',
  },
  withCredentials: false,
  onUnauthorized: () => {
    // Redirect to login
    window.location.href = '/login';
  },
  onForbidden: () => {
    // Show permission error
    console.error('Access denied');
  },
  onServerError: (error) => {
    // Log to monitoring service
    console.error('Server error:', error);
  },
});
```

## Integration with React Query

### API Layer

```typescript
// api/users.api.ts
import { get, post, put, del } from '@optum-rx-core/orx-core-client-shared';
import type { User, CreateUserDto, UpdateUserDto } from '../types';

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    return get<User[]>('/users');
  },

  getUser: async (id: string): Promise<User> => {
    return get<User>(`/users/${id}`);
  },

  createUser: async (data: CreateUserDto): Promise<User> => {
    return post<User, CreateUserDto>('/users', data);
  },

  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    return put<User, UpdateUserDto>(`/users/${id}`, data);
  },

  deleteUser: async (id: string): Promise<void> => {
    return del(`/users/${id}`);
  },
};
```

### Query Options

```typescript
// queries/user.queries.ts
import { queryOptions } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';

export const userQueries = {
  all: () => ['users'] as const,

  detail: (id: string) =>
    queryOptions({
      queryKey: [...userQueries.all(), 'detail', id] as const,
      queryFn: () => usersApi.getUser(id),
    }),

  list: () =>
    queryOptions({
      queryKey: [...userQueries.all(), 'list'] as const,
      queryFn: () => usersApi.getUsers(),
    }),
};
```

### Custom Hooks

```typescript
// hooks/useUser.ts
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueries } from '../queries/user.queries';

export const useUser = (id: string) => {
  return useSuspenseQuery(userQueries.detail(id));
};

export const useUsers = () => {
  return useSuspenseQuery(userQueries.list());
};
```

## Error Handling

### Using isApiError Type Guard

```typescript
import { isApiError } from '@optum-rx-core/orx-core-client-shared';

try {
  const user = await get<User>('/users/123');
} catch (error) {
  if (isApiError(error)) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
  } else {
    console.error('Unknown error:', error);
  }
}
```

### With React Query

```typescript
import { useMutation } from '@tanstack/react-query';
import { isApiError } from '@optum-rx-core/orx-core-client-shared';

const { mutate } = useMutation({
  mutationFn: (data: CreateUserDto) => usersApi.createUser(data),
  onError: (error) => {
    if (isApiError(error)) {
      if (error.status === 409) {
        // Handle conflict
        showToast('User already exists');
      } else {
        showToast(error.message);
      }
    }
  },
});
```

## Authentication

The axios instance automatically:
1. Retrieves auth tokens from `sessionStorage` or `localStorage`
2. Adds `Authorization: Bearer <token>` header to requests
3. Clears tokens on 401 responses
4. Calls `onUnauthorized` callback if configured

### Setting Auth Token

```typescript
// After successful login
sessionStorage.setItem('authToken', token);
// or
localStorage.setItem('authToken', token);
```

### Custom Token Retrieval

If you need custom token logic, create a custom instance:

```typescript
import axios from 'axios';

const customClient = axios.create({
  baseURL: '/api',
});

customClient.interceptors.request.use((config) => {
  const token = getCustomToken(); // Your custom logic
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Request Tracking

Every request automatically includes an `X-Correlation-ID` header for distributed tracing:

```
X-Correlation-ID: 1709123456789-abc123def
```

This helps track requests across services and logs.

## Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

### Default Values

- **Base URL**: `process.env.NEXT_PUBLIC_API_BASE_URL` or `/api`
- **Timeout**: 30 seconds
- **Content-Type**: `application/json`
- **Credentials**: Included (`withCredentials: true`)

## TypeScript Types

```typescript
import type {
  ApiError,
  ApiClientConfig,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '@optum-rx-core/orx-core-client-shared';

// Use in your API layer
const getUsers = async (
  params: PaginationParams
): Promise<PaginatedResponse<User>> => {
  return get<PaginatedResponse<User>>('/users', { params });
};
```

## Best Practices

1. **Create dedicated API layers** - Don't call axios directly in components
2. **Use type-safe wrappers** - Prefer `get<T>()` over `apiClient.get<T>()`
3. **Define response types** - Always specify expected response types
4. **Handle errors consistently** - Use `isApiError` type guard
5. **Use React Query** - Integrate with React Query for caching and state management
6. **Configure callbacks** - Set up `onUnauthorized`, `onForbidden` handlers
7. **Use queryOptions** - Create reusable query configurations
8. **Separate concerns** - Keep API logic separate from business logic

## Testing

```typescript
import { apiClient } from '@optum-rx-core/orx-core-client-shared';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(apiClient);

describe('usersApi', () => {
  afterEach(() => {
    mock.reset();
  });

  it('fetches users successfully', async () => {
    const users = [{ id: '1', name: 'John' }];
    mock.onGet('/users').reply(200, users);

    const result = await usersApi.getUsers();
    expect(result).toEqual(users);
  });

  it('handles errors', async () => {
    mock.onGet('/users').reply(500, { message: 'Server error' });

    await expect(usersApi.getUsers()).rejects.toMatchObject({
      message: 'Server error',
      status: 500,
    });
  });
});
```
