# E-commerce Store Backend

Welcome to the backend server for the E-commerce Store project. This project provides a robust, scalable RESTful API built on top of Node.js and Express to manage the store's core operations, including products, users, categories, and shopping flow.

## 🚀 Tech Stack

- **Runtime & Framework**: Node.js, Express.js
- **Language**: TypeScript
- **Database & ORM**: PostgreSQL, Sequelize (`@sequelize/core` v7 alpha)
- **Caching & Sessions**: Redis, `ioredis`, `connect-redis`
- **Validation**: Zod
- **Authentication**: JWT (`jsonwebtoken`), bcryptjs
- **File Uploads**: Multer
- **Logging**: Winston, Morgan
- **Package Manager**: pnpm

## 📂 Architecture & Directory Structure

The application follows a standard Layered Architecture inside the `backend/` directory to separate concerns:

```
backend
├── 📁 docs
│   └── 📝 MULTER_GUIDE.md
├── 📁 public
│   └── 🌐 status.html
├── 📁 src
│   ├── 📁 .depricated
│   │   └── 📄 index.model.ts
│   ├── 📁 configs
│   │   ├── 📄 constant.config.ts
│   │   └── 📄 message.config.ts
│   ├── 📁 controller
│   │   ├── 📁 v1
│   │   │   ├── 📁 product
│   │   │   │   ├── 📁 .depreciated
│   │   │   │   │   └── 📄 volume.controller.ts
│   │   │   │   ├── 📄 brand.controller.ts
│   │   │   │   ├── 📄 category.controller.ts
│   │   │   │   ├── 📄 color.controller.ts
│   │   │   │   ├── 📄 countryOfOrigin.controller.ts
│   │   │   │   ├── 📄 dimension.controller.ts
│   │   │   │   ├── 📄 fabric.controller.ts
│   │   │   │   ├── 📄 length.controller.ts
│   │   │   │   ├── 📄 occasion.controller.ts
│   │   │   │   ├── 📄 pattern.controller.ts
│   │   │   │   ├── 📄 product.controller.ts
│   │   │   │   ├── 📄 productType.controller.ts
│   │   │   │   ├── 📄 shippingCharge.controller.ts
│   │   │   │   ├── 📄 size.controller.ts
│   │   │   │   ├── 📄 subcategory.controller.ts
│   │   │   │   └── 📄 weight.controller.ts
│   │   │   ├── 📁 user
│   │   │   │   ├── 📄 address.controller.ts
│   │   │   │   ├── 📄 auth.controller.ts
│   │   │   │   ├── 📄 cart.controller.ts
│   │   │   │   ├── 📄 session.controller.ts
│   │   │   │   ├── 📄 user.controller.ts
│   │   │   │   └── 📄 wishlist.controller.ts
│   │   │   └── 📄 base.controller.ts
│   │   ├── 📄 health.controller.ts
│   │   └── 📄 status.controller.ts
│   ├── 📁 database
│   │   └── 📄 database.ts
│   ├── 📁 middleware
│   │   ├── 📄 auth.middleware.ts
│   │   ├── 📄 errorHandler.middleware.ts
│   │   ├── 📄 multer.middleware.ts
│   │   ├── 📄 requestLogger.middleware.ts
│   │   ├── 📄 sessionMetadata.middleware.ts
│   │   └── 📄 validate.middleware.ts
│   ├── 📁 models
│   │   ├── 📁 product
│   │   │   ├── 📁 .depreciated
│   │   │   │   └── 📄 volume.model.ts
│   │   │   ├── 📄 brand.model.ts
│   │   │   ├── 📄 category.model.ts
│   │   │   ├── 📄 color.model.ts
│   │   │   ├── 📄 countryOfOrigin.model.ts
│   │   │   ├── 📄 dimension.model.ts
│   │   │   ├── 📄 fabric.model.ts
│   │   │   ├── 📄 length.model.ts
│   │   │   ├── 📄 occasion.model.ts
│   │   │   ├── 📄 pattern.model.ts
│   │   │   ├── 📄 product.model.ts
│   │   │   ├── 📄 productType.model.ts
│   │   │   ├── 📄 shippingCharge.model.ts
│   │   │   ├── 📄 size.model.ts
│   │   │   ├── 📄 subcategory.model.ts
│   │   │   └── 📄 weight.model.ts
│   │   ├── 📁 users
│   │   │   ├── 📄 user.model.ts
│   │   │   ├── 📄 userAddress.model.ts
│   │   │   ├── 📄 userCart.model.ts
│   │   │   ├── 📄 userSession.model.ts
│   │   │   └── 📄 userWishList.model.ts
│   │   └── 📄 index.model.ts
│   ├── 📁 routes
│   │   ├── 📁 v1
│   │   │   ├── 📁 auth
│   │   │   │   └── 📄 auth.route.ts
│   │   │   ├── 📁 product
│   │   │   │   ├── 📁 .depreciated
│   │   │   │   │   └── 📁 volume
│   │   │   │   │       └── 📄 volume.route.ts
│   │   │   │   ├── 📁 brand
│   │   │   │   │   └── 📄 brand.route.ts
│   │   │   │   ├── 📁 category
│   │   │   │   │   └── 📄 category.route.ts
│   │   │   │   ├── 📁 color
│   │   │   │   │   └── 📄 color.route.ts
│   │   │   │   ├── 📁 countryOfOrigin
│   │   │   │   │   └── 📄 countryOrigin.route.ts
│   │   │   │   ├── 📁 dimension
│   │   │   │   │   └── 📄 dimension.route.ts
│   │   │   │   ├── 📁 fabric
│   │   │   │   │   └── 📄 fabric.route.ts
│   │   │   │   ├── 📁 length
│   │   │   │   │   └── 📄 length.route.ts
│   │   │   │   ├── 📁 occasion
│   │   │   │   │   └── 📄 occasion.route.ts
│   │   │   │   ├── 📁 pattern
│   │   │   │   │   └── 📄 pattern.route.ts
│   │   │   │   ├── 📁 product
│   │   │   │   │   └── 📄 product.route.ts
│   │   │   │   ├── 📁 productType
│   │   │   │   │   └── 📄 productType.route.ts
│   │   │   │   ├── 📁 shippingCharge
│   │   │   │   │   └── 📄 shippingCharge.route.ts
│   │   │   │   ├── 📁 size
│   │   │   │   │   └── 📄 size.route.ts
│   │   │   │   ├── 📁 subcategory
│   │   │   │   │   └── 📄 subcategory.route.ts
│   │   │   │   ├── 📁 weight
│   │   │   │   │   └── 📄 weight.route.ts
│   │   │   │   └── 📄 product.route.ts
│   │   │   └── 📁 user
│   │   │       ├── 📄 address.route.ts
│   │   │       ├── 📄 cart.route.ts
│   │   │       ├── 📄 user.route.ts
│   │   │       └── 📄 whishlist.route.ts
│   │   ├── 📄 health.route.ts
│   │   └── 📄 status.route.ts
│   ├── 📁 services
│   │   └── 📄 base.service.ts
│   ├── 📁 types
│   │   └── 📄 express-session.d.ts
│   ├── 📁 utils
│   │   ├── 📄 appError.util.ts
│   │   ├── 📄 asyncHandler.util.ts
│   │   ├── 📄 jwt.util.ts
│   │   ├── 📄 logger.util.ts
│   │   ├── 📄 metaData.util.ts
│   │   ├── 📄 redis.util.ts
│   │   ├── 📄 responseHandler.util.ts
│   │   ├── 📄 slug.util.ts
│   │   └── 📄 token.util.ts
│   ├── 📁 validations
│   │   ├── 📁 product
│   │   │   ├── 📁 .depreciated
│   │   │   │   └── 📄 volume.validation.ts
│   │   │   ├── 📄 brand.validation.ts
│   │   │   ├── 📄 color.validation.ts
│   │   │   ├── 📄 countryOfOrigin.validation.ts
│   │   │   ├── 📄 dimension.validation.ts
│   │   │   ├── 📄 fabric.validation.ts
│   │   │   ├── 📄 length.validation.ts
│   │   │   ├── 📄 occasion.validation.ts
│   │   │   ├── 📄 pattern.validation.ts
│   │   │   ├── 📄 productType.validation.ts
│   │   │   ├── 📄 shippingCharge.validation.ts
│   │   │   ├── 📄 size.validation.ts
│   │   │   └── 📄 weight.validation.ts
│   │   ├── 📁 user
│   │   │   ├── 📄 address.validation.ts
│   │   │   ├── 📄 auth.validation.ts
│   │   │   ├── 📄 cart.validation.ts
│   │   │   └── 📄 wishlist.validation.ts
│   │   └── 📄 uuid.validation.ts
│   ├── 📄 app.ts
│   └── 📄 index.ts
├── 📁 uploads
├── 📝 README.md
├── ⚙️ package.json
├── ⚙️ pnpm-lock.yaml
└── ⚙️ tsconfig.json
```

## ⚙️ Core Features

- **Advanced Product Management**: Supports deep product configurations including `Brands`, `Colors`, `Dimensions`, `Fabrics`, `Lengths`, `Occasions`, `Patterns`, `Sizes`, `Weights`, and `ProductTypes`.
- **Authentication**: Secure user authentication using JWT and bcrypt, with session management backed by Redis.
- **Robust Validation**: Type-safe runtime request validation via Zod schemas.
- **SEO Ready**: Utilities available for auto-generating Meta Titles, Descriptions, and Keywords based on dynamic product attributes.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Redis
- pnpm

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```
2. Install dependencies via pnpm:

   ```bash
   pnpm install
   ```
3. Setup environment variables by copying `.env.example` to `.env` and adjusting configurations (Database connection, Redis URL, JWT Secret, etc).

### Running the Application

- **Development Mode**: Runs via `tsx` with hot-reloading.
  ```bash
  pnpm run dev
  ```
- **Build**: Compiles TypeScript down to JavaScript.
  ```bash
  pnpm run build
  ```
- **Production Mode**: Runs the compiled javascript.
  ```bash
  pnpm start
  ```

## 📝 API Documentation

Detailed API routes and endpoints are stored as OpenAPI JSON specifications in the root project's `ApiCollections/` directory. You can import these directly into Postman or Swagger UI.
