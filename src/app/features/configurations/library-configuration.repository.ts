import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../core/environment';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LibraryConfigurationRepository {
  private http = inject(HttpClient);

  deleteConfiguration(publicId: string): Observable<void> {
    const url = `${environment.apiUrl}/configurations/my/${publicId}`;
    return this.http.delete<void>(url);
  }

  createConfiguration(
    name: string,
    description: string
  ): Observable<CreateResponse> {
    const url = `${environment.apiUrl}/configurations/my/create`;
    return this.http.post<CreateResponse>(url, {name, description});
  }

  createConfigurationFull(
    createRequest: CreateConfigurationRequest
  ) {
    const url = `${environment.apiUrl}/configurations/my/create/full`;
    return this.http.post<CreateResponse>(url, createRequest);
  }

  updateConfigurationStructure(
    publicId: string,
    updateConfigurationStructureRequest: UpdateConfigurationStructureRequest
  ) {
    const url = `${environment.apiUrl}/configurations/my/${publicId}`;
    return this.http.patch<void>(url, updateConfigurationStructureRequest);
  }




}

export interface CreateResponse {
  publicId: string;
}


export interface CreateConfigurationRequest {
  name: string;
  description: string;
  panels: {
    uid: string;
    x: number;
    y: number;
    direction: string;
  }[];
  frames: {
    index: number;
    panelPixelColors: string; // JSON строка
  }[];
}

export interface UpdateConfigurationStructureRequest {
  panels: {
    uid: string;
    x: number;
    y: number;
    direction: string;
  }[];
  frames: {
    index: number;
    panelPixelColors: string; // JSON строка
  }[];
}
