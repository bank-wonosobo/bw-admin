export interface INews {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  image_url: string;
  published_at: string;
  status: "draft" | "published" | "archived";
  approved_by: string;
  created_at: string;
  updated_at: string;
}
