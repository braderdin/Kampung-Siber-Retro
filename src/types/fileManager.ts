export interface SiteFile {
  id: string;
  filename: string;
  size: number;
  contentType: string;
  uploadedAt: string;
  url: string;
  type: 'file';
}

export interface SiteFolder {
  id: string;
  name: string;
  createdAt: string;
  type: 'folder';
}

export type FileManagerItem = SiteFile | SiteFolder;
export type FileAction = 'edit' | 'navigate' | 'rename' | 'delete' | 'view';
