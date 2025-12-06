export function useApp(): { isDev: boolean } {
  return {
    isDev: import.meta.env.DEV,
  };
}
