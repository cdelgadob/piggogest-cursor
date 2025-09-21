import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { Expediente } from '../models/expediente.model';
import { GET_EXPEDIENTES, GET_EXPEDIENTE_BY_ID } from '../graphql/queries';

@Injectable({
  providedIn: 'root'
})
export class ExpedientesService {
  constructor(private apollo: Apollo) {}

  getExpedientes(): Observable<Expediente[]> {
    return this.apollo
      .watchQuery<{ expedientes: Expediente[] }>({
        query: GET_EXPEDIENTES,
        errorPolicy: 'all'
      })
      .valueChanges.pipe(
        map(result => result.data?.expedientes || [])
      );
  }

  getExpedienteById(id: string): Observable<Expediente | null> {
    return this.apollo
      .watchQuery<{ expediente: Expediente }>({
        query: GET_EXPEDIENTE_BY_ID,
        variables: { id },
        errorPolicy: 'all'
      })
      .valueChanges.pipe(
        map(result => result.data?.expediente || null)
      );
  }
}