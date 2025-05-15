import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environment';
import { Observable } from 'rxjs';

export interface PublishResponse {
  publicId: string;
}

export interface SearchRequest {
  searchQuery:     string;
  tagFilterIds:    string[];
  tagMatchMode:    'ANY' | 'ALL';
  publishedAtRange: { from: string; to: string } | null;
  ratingRange:     { from: number | null; to: number | null };
  addedCountRange: { from: number | null; to: number | null };
  sortBy:          Record<string, { order: 'ASC' | 'DESC' }>;
  offset:          number;
  size:            number;
}

export interface GalleryItem {
  publicId:        string;
  name:            string;
  description:     string;
  previewImageUrl: string;
  author: {
    publicId:    string;
    username:    string;
    avatarUrl:   string;
    displayName: string;
  };
  tags:            string[];
  createdAt:       string;
  publishedAt:     string;
  averageRating:   number;
  addedCount:      number;
}

@Injectable({ providedIn: 'root' })
export class GalleryConfigurationRepository {
  private http = inject(HttpClient);

  private base = `${environment.apiUrl}/configurations/gallery`;

  publishConfiguration(
    publicId: string,
    newName: string,
    newDescription: string
  ): Observable<PublishResponse> {
    const url = `${this.base}/${publicId}/publish`;
    const body = {
      newName,
      newDescription
    };
    return this.http.post<PublishResponse>(url, body);
  }

  subscribeConfiguration(publicId:string){
    const url = `${this.base}/${publicId}/subscribe`;
    return this.http.post<PublishResponse>(url, publicId);
  }

  search(req: SearchRequest): Observable<GalleryItem[]> {
    console.log(req)
    return this.http.post<GalleryItem[]>(`${this.base}/search`, req);
  }
}
