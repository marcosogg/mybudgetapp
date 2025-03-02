
export interface IntercomSettings {
  app_id: string;
  name?: string;
  email?: string;
  user_id?: string;
  created_at?: number;
}

declare global {
  interface Window {
    Intercom?: {
      (command: 'boot' | 'update' | 'show' | 'hide' | 'shutdown', settings?: IntercomSettings): void;
      booted: boolean;
    };
  }
}
