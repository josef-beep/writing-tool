export const READINESS_CHANNEL = 'writingtool:readiness:v1';
export function trustedSender(senderId: number, ownedId: number, isMainFrame: boolean, actualUrl: string, expectedUrl: string): boolean {
  return senderId === ownedId && isMainFrame && actualUrl === expectedUrl;
}
