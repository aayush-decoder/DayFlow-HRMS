import jwt from "jsonwebtoken"

export function getAuth(request: Request) {
  // DEV MODE OVERRIDE (TEMPORARY) // testing
  if (process.env.NODE_ENV !== "production") {
    const devUser = request.headers.get("x-dev-user")

    if (devUser === "employee") {
      return {
        userId: "dev-user-emp",
        role: "EMPLOYEE",
        companyId: "dev-company",
        employeeId: "dev-employee"
      }
    }

    if (devUser === "admin") {
      return {
        userId: "dev-user-admin",
        role: "ADMIN",
        companyId: "dev-company",
        employeeId: null
      }
    }
  }

  // REAL AUTH (production)
  const auth = request.headers.get("authorization")
  if (!auth) throw new Error("Unauthorized")

  const token = auth.replace("Bearer ", "")
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as any

  return {
    userId: payload.userId,
    role: payload.role,
    companyId: payload.companyId,
    employeeId: payload.employeeId ?? null
  }
}
