export enum UserType {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_administration',
  TENANT_USER = 'tenant_user',
}

export const USER_TYPE_HIERARCHY = {
  [UserType.SUPER_ADMIN]: 1,
  [UserType.TENANT_ADMIN]: 2,
  [UserType.TENANT_USER]: 3,
};