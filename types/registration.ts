export type RegistrationStep = 1 | 2 | 3;

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  ok: true;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  officeName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface RegisteredUser {
  id: string;
  firstName: string;
  lastName: string;
  officeName: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

export interface ApiErrorResponse {
  error: string;
  retryAfterSeconds?: number;
  fieldErrors?: Record<string, string[]>;
}
