# Frontend Authentication

The authentication UI is implemented using React components and `react-router-dom`.

## Components

### SignIn

Located at `client/components/auth/SignIn.tsx`.

- route: `/signin`
- Features: Email/Password login form.
- Mock behavior: Simulates a login delay and redirects to `/dashboard`.

### SignUp

Located at `client/components/auth/SignUp.tsx`.

- route: `/signup`
- Features: Name, Email, Password registration form.
- Mock behavior: Simulates registration delay and redirects to `/dashboard`.

## Routing

Routes are defined in `client/App.tsx`.
These routes are **public** and exist outside the main `Layout` component, providing a dedicated full-screen experience.

## Usage

To access these pages, navigate manually or use the links provided within the components.

- SignIn links to SignUp.
- SignUp links to SignIn.
