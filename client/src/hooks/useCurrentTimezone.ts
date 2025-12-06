export function useCurrentTimezone() {
  return { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
}
