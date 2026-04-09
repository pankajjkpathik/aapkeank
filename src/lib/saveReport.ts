import { supabase } from "@/integrations/supabase/client";

export async function saveReport(clientName: string, reportType: string, dob: string, data: any) {
  try {
    await supabase.from("generated_reports").insert({
      client_name: clientName,
      report_type: reportType,
      dob,
      data,
    });
  } catch (e) {
    console.error("Failed to save report:", e);
  }
}
