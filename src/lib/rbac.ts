type UserRole = "client" | "freelancer" | "admin";

export function assertRole(role: UserRole | undefined, allowedRoles: UserRole[]) {
  if (!role || !allowedRoles.includes(role)) {
    throw new Error("你没有权限执行此操作。");
  }
}
