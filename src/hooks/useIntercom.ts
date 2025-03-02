
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { IntercomSettings } from '@/types/intercom';

export const useIntercom = () => {
  const { toast } = useToast();

  const showMessenger = useCallback(() => {
    if (window.Intercom) {
      window.Intercom('show');
    } else {
      toast({
        title: 'Error',
        description: 'Intercom messenger is not available',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const hideMessenger = useCallback(() => {
    if (window.Intercom) {
      window.Intercom('hide');
    }
  }, []);

  const updateSettings = useCallback((settings: Partial<IntercomSettings> & { app_id: string }) => {
    if (window.Intercom) {
      window.Intercom('update', settings);
    }
  }, []);

  return {
    showMessenger,
    hideMessenger,
    updateSettings,
  };
};
