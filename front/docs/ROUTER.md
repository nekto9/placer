# Документация роутера

## Обзор

Роутер в проекте построен на основе React Router v6 и использует модульную архитектуру для организации маршрутов. Система роутинга разделена на несколько уровней абстракции для удобства поддержки и масштабирования.

## Архитектура

### Основные компоненты

1. **index.tsx** - главная точка входа роутера
2. **routeConstant.ts** - константы для путей
3. **routes.tsx** - объединение всех маршрутов
4. **routesList.ts** - централизованный доступ к генераторам путей
5. **routes/** - папка с определениями маршрутов по модулям
6. **routesPath/** - папка с генераторами URL-путей

### Структура файлов

```
router/
├── index.tsx                    # Главный роутер
├── routeConstant.ts            # Константы путей
├── routes.tsx                  # Объединение маршрутов
├── routesList.ts              # Централизованный доступ к путям
├── routes/                    # Определения маршрутов
│   ├── routesProfile.tsx
│   ├── routesPlace.tsx
│   ├── routesGame.tsx
│   ├── routesUsers.tsx
│   └── routesMessages.tsx
└── routesPath/               # Генераторы URL-путей
    ├── routesListProfile.ts
    ├── routesListPlace.ts
    ├── routesListGame.ts
    ├── routesListUsers.ts
    └── routesListMessages.ts
```

## Константы маршрутов

```typescript
export enum RoutesConst {
  ROOT = "/",
  PROFILE = "profile",
  PLACE = "place",
  SCHEDULES = "schedule",
  CALENDAR = "calendar",
  TIME = "time",
  GAME = "game",
  USERS = "users",
  MESSAGES = "messages",
  ADD = "add",
  EDIT = "edit",
}
```

## Модули маршрутов

**Доступный маршрут (пример):**

- `GET /profile` - страница профиля пользователя

**Генераторы путей:**

```typescript
RoutesListProfile.getUserProfile(); // "/profile"
RoutesListProfile.getUserProfileEdit(); // "/profile/edit"
```


### Навигация в компонентах

```typescript
import { useNavigate } from 'react-router-dom';
import { RoutesList } from '@/router/routesList';

const MyComponent = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(RoutesList.Profile.getUserProfile());
  };

  const goToPlaceDetails = (placeId: string) => {
    navigate(RoutesList.Place.getPlaceDetails(placeId));
  };

  return (
    // JSX
  );
};
```

### Создание ссылок

```typescript
import { Link } from 'react-router-dom';
import { RoutesList } from '@/router/routesList';

const MyComponent = () => {
  return (
    <div>
      <Link to={RoutesList.Profile.getUserProfile()}>
        Мой профиль
      </Link>
      <Link to={RoutesList.Place.getPlacesList()}>
        Площадки
      </Link>
    </div>
  );
};
```


## Добавление новых маршрутов

### Шаг 1: Добавить константу

```typescript
// routeConstant.ts
export enum RoutesConst {
  // ... существующие константы
  NEW_MODULE = "new-module",
}
```

### Шаг 2: Создать генераторы путей

```typescript
// routesPath/routesListNewModule.ts
export const RoutesListNewModule = {
  getList: () => `${RoutesConst.ROOT}${RoutesConst.NEW_MODULE}`,
  getDetails: (id: string) =>
    `${RoutesConst.ROOT}${RoutesConst.NEW_MODULE}/${id}`,
};
```

### Шаг 3: Определить маршруты

```typescript
// routes/routesNewModule.tsx
export const routesNewModule: RouteObject[] = [
  {
    path: RoutesList.NewModule.getList(),
    element: <NewModuleListPage />,
  },
  // ... другие маршруты
];
```

### Шаг 4: Добавить в общие файлы

```typescript
// routesList.ts
export const RoutesList = {
  // ... существующие модули
  NewModule: RoutesListNewModule,
};

// routes.tsx
export const routes: RouteObject[] = [
  // ... существующие маршруты
  ...routesNewModule,
];
```
