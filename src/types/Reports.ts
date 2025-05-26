export interface IReports {
  id: string;
  title: string;
  description: string;
  period_start: string;
  period_end: string;
  year: number;
  quarter: string;
  fileurl: string;
  version: string;
  status: "draft" | "published" | "archived";
  upload_by: string;
  approved_by: string;
  report_type: string;
}
