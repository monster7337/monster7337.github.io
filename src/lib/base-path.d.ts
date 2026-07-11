export const basePath: string;
export const siteOrigin: string;

export function withBasePath(path?: string): string;
export function stripBasePath(pathname?: string): string;
export function getPublicBasePath(): string;
export function absoluteUrl(path?: string): string;
