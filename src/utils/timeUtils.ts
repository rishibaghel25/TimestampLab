export const toUnix = (date: string) => Math.floor(new Date(date).getTime() / 1000);
export const fromUnix = (timestamp: number) => new Date(timestamp * 1000).toISOString();
