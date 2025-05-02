import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environment';
import { Observable } from 'rxjs';

export interface Configuration {
  publicId: string;
  name: string;
  description: string;
  previewImageUrl: string;
  miniPreviewImageUrl: string;
  miniPreviewPanelUid: string | null;
  useMiniPreview: boolean;
  forkStatus: 'ORIGINAL' | 'ADDED' | 'MODIFIED';
  isPublic: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigurationRepository {
  constructor(private http: HttpClient) {}

  getById(publicId: string): Observable<Configuration> {
    return this.http.get<Configuration>(
      `${environment.apiUrl}/configurations/my/${publicId}`
    );
  }

  update(
    publicId: string,
    patch: Partial<Pick<Configuration, 'name' | 'description' | 'useMiniPreview'>>
  ): Observable<Configuration> {
    return this.http.patch<Configuration>(
      `${environment.apiUrl}/configurations/my/${publicId}/data`,
      patch
    );
  }
}
