export interface JwtPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  companyId: string;
}
