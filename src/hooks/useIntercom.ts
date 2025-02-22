
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

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

  const updateSettings = useCallback((settings: Partial<IntercomSettings>) => {
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
