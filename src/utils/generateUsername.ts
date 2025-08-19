import crypto from "crypto";

type UserRole = "WL_ADMIN" | "SUPER_DISTRIBUTOR" | "DISTRIBUTOR" | "RETAILER" | "EMPLOYEE";

export function generateUsername(role: UserRole, tenantSlug: string) {
  const rolePrefixMap: Record<UserRole, string> = {
    WL_ADMIN: "wladmin",
    SUPER_DISTRIBUTOR: "super-dist",
    DISTRIBUTOR: "dist",
    RETAILER: "ret",
    EMPLOYEE: "emp",
  };

  const prefix = rolePrefixMap[role];
  const uniqueSuffix = crypto.randomUUID().slice(0, 6); // short unique ID

  return `${prefix}_${tenantSlug}_${uniqueSuffix}`;
}
