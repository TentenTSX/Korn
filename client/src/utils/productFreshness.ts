export const NEW_PRODUCT_WINDOW_DAYS = 7;

export function isRecentlyAdded(createdAt: string) {
  const ageInDays =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return ageInDays <= NEW_PRODUCT_WINDOW_DAYS;
}
