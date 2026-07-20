export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  officeName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "USER";
};
