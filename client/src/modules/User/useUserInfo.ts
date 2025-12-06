export function useUserInfo(): {
  /** User's local timezone but still adjustable  */
  tz: string;
} {
  return { tz: Intl.DateTimeFormat().resolvedOptions().timeZone };
}
