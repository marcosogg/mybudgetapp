import { supabase } from "@/integrations/supabase/client";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const useEmail = () => {
  const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: { to, subject, html },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Error sending email:", error);
      return { data: null, error };
    }
  };

  return { sendEmail };
};