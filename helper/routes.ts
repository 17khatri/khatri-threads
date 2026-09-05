const ROUTES = {
  // Dashboard
  DASHBOARD: "/",
  ADMIN_DASHBOARD: "/admin/dashboard",
  CATEGORIES: "/admin/categories",
  USERS: "/admin/users",
  SHOP: "/products",
  ADMIN_COLLECTIONS: "/admin/collections",
  PRODUCTS: "/admin/products",
  ADMIN_COLORS: "/admin/colors",
  ADMIN_CUSTOMIZER_PRODUCTS: "/admin/customizer-products",
  CUSTOMIZE: "/customize",

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
  [ROUTES.ADMIN_DASHBOARD]: "Dashboard",
  [ROUTES.CATEGORIES]: "Categories",
  [ROUTES.PROFILE]: "Profile",
  [ROUTES.LOGIN]: "Login",
  [ROUTES.REGISTER]: "Register",
  [ROUTES.FORGOT_PASSWORD]: "Forgot Password",
  [ROUTES.NOT_FOUND]: "Page Not Found",
  [ROUTES.USERS]: "Users",
  [ROUTES.SHOP]: "Products",
  [ROUTES.ADMIN_COLLECTIONS]: "Collections",
  [ROUTES.PRODUCTS]: "Products",
  [ROUTES.ADMIN_COLORS]: "Colors",
  [ROUTES.ADMIN_CUSTOMIZER_PRODUCTS]: "Customizer Products",
  [ROUTES.CUSTOMIZE]: "Customize T-Shirt",
};

export default ROUTES;
