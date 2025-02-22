
import { useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const INTERCOM_APP_ID = 'dhcwev5z';

export function IntercomProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();

  useEffect(() => {
    // Initialize Intercom
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://widget.intercom.io/widget/' + INTERCOM_APP_ID;
    document.head.appendChild(script);

    script.onload = () => {
      window.Intercom?.('boot', {
        app_id: INTERCOM_APP_ID,
      });
    };

    return () => {
      // Cleanup Intercom on unmount
      window.Intercom?.('shutdown');
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user && profile) {
        window.Intercom?.('update', {
          name: profile.name,
          email: profile.email,
          user_id: session.user.id,
          created_at: new Date(profile.created_at).getTime() / 1000,
        });
      }
      
      if (event === 'SIGNED_OUT') {
        window.Intercom?.('shutdown');
        window.Intercom?.('boot', { app_id: INTERCOM_APP_ID });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [profile]);

  return <>{children}</>;
}
