const ROUTES = {
  // Dashboard
  DASHBOARD: "/",
  CATEGORIES: "/categories",
  USERS: "/users",
  COLLECTIONS: "/collections",
  ADMIN_COLLECTIONS: "/admin/collections",
  PRODUCTS: "/admin/products",

  // Authentication
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Profile
  PROFILE: "/profile",

  // 404
  NOT_FOUND: "/404",
} as const;

export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.CATEGORIES]: "Categories",
  [ROUTES.PROFILE]: "Profile",
  [ROUTES.LOGIN]: "Login",
  [ROUTES.REGISTER]: "Register",
  [ROUTES.FORGOT_PASSWORD]: "Forgot Password",
  [ROUTES.NOT_FOUND]: "Page Not Found",
  [ROUTES.USERS]: "Users",
  [ROUTES.COLLECTIONS]: "Collections",
  [ROUTES.ADMIN_COLLECTIONS]: "Collections",
  [ROUTES.PRODUCTS]: "Products",
};

export default ROUTES;
