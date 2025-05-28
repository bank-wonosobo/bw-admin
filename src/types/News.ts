export interface INews {
  ID: string;
  Title: string;
  Slug: string;
  Content: string;
  Author: string;
  ImageUrl: string;
  PublishedAt: string;
  Status: "draft" | "published" | "archived";
  ApprovedBy: string;
  CreatedAt: string;
  UpdatedAt: string;
}
