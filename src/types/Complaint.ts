export interface IComplaint {
  id: string;
  complaint_id: string;
  reported_name: string;
  email: string;
  insident_location: string;
  insident_time: string;
  description: string;
  evidence_url: string;
  reporter_name: string;
  reporter_phone: string;
  status: "pending" | "process" | "done";
  complaint_type: string;
}
