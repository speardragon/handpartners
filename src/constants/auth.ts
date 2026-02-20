/** 사용자 역할 상수. Edge runtime 호환을 위해 순수 원시값만 사용. */
export const USER_ROLES = {
  ADMIN: "관리자",
  JUDGE: "심사자",
} as const;

/** USER_ROLES 값의 유니온 타입 */
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
