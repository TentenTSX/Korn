export function focalPointStyle(focalPoint: string | null | undefined) {
  return focalPoint ? { objectPosition: `center ${focalPoint}` } : undefined;
}
