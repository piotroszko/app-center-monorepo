"use client";

export interface File {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  path: string;
  isRenamble: boolean;
  isDeletable: boolean;
}

export interface Directory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  contents: (File | Directory)[];
  path: string;
  isRenamble: boolean;
  isDeletable: boolean;
}

export interface FilesViewProps {
  directory: Directory;
}
