
interface IntercomSettings {
  app_id: string;
  name?: string;
  email?: string;
  user_id?: string;
  created_at?: number;
}

interface IntercomWindow extends Window {
  intercomSettings?: IntercomSettings;
  Intercom?: {
    (...args: any[]): void;
    booted: boolean;
  };
}

declare global {
  interface Window extends IntercomWindow {}
}

export type { IntercomSettings, IntercomWindow };
