// src/app/configuration/data/gallery-configuration.repository.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environment';
import { Observable } from 'rxjs';

export interface PublishResponse {
  publicId: string;
}

@Injectable({ providedIn: 'root' })
export class GalleryConfigurationRepository {
  private http = inject(HttpClient);

  publishConfiguration(
    publicId: string,
    newName: string,
    newDescription: string
  ): Observable<PublishResponse> {
    const url = `${environment.apiUrl}/configurations/gallery/${publicId}/publish`;
    const body = {
      newName,
      newDescription
    };
    return this.http.post<PublishResponse>(url, body);
  }
}
