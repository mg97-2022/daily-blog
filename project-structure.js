/*
src/
│
├── main.ts
├── app.module.ts
│
├── common/                 # Reusable building blocks
│   ├── constants/          # App-wide constant values
│   ├── decorators/         # Custom decorators
│   ├── enums/              # App-wide enums
│   ├── helpers/            # Utility functions / services
│   └── validators/         # Custom class-validator rules
|
├── config/                  # Global app configuration
│   ├── app.config.ts
│   └── database.config.ts
│
├── http/                   # HTTP layer concerns
│   ├── filters/            # Exception filters
│   ├── guards/             # Route guards
│   ├── interceptors/       # Request/response interceptors
│   ├── middlewares/        # Middlewares
│   └── pipes/              # Custom validation pipes
│
├── infrastructure/         # Low-level modules & services
│   ├── logger/             # Winston logger service
│   ├── database/           # Database setup and providers
│   ├── environment/        # Environment module
│   ├── multer/             # Multer config for file uploads
│   └── rate-limiter/       # Throttling config
│
├── modules/                # Feature modules (business logic)
│   ├── users/
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   ├── users.module.ts
│   │   └── test/
│   │       └── users.service.spec.ts
│   │
│   ├── auth/
│   │   ├── dto/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── test/
│   │       └── auth.service.spec.ts
│
├── shared/                 # Commonly shared modules (optional)
│   └── email/
│       ├── email.service.ts
│       └── email.module.ts
│
└── test/                   # E2E / Integration tests
    └── auth.e2e-spec.ts
*/