export interface IAnnouncement {
  id: string;
  title: string;
  content: string;
  author: string;
  target_audience: string;
  start_date: string;
  end_date: string;
  attachment_url: string;
  is_active: boolean;
  published_at: string;
  status: "draft" | "published" | "archived";
  approved_by: string;
  created_at: string;
  updated_at: string;
}
