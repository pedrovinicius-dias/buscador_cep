import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ViaCepResponse } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://viacep.com.br/ws';

  /**
   * Monta e retorna a URL da API ViaCEP para o CEP informado.
   * @param cep CEP com ou sem formatação
   */
  getUrl(cep: string): string {
    const sanitizedCep = cep.replace(/\D/g, '');
    return `${this.baseUrl}/${sanitizedCep}/json/`;
  }

  /**
   * Consulta o endereço utilizando o HttpClient.
   * @param cep CEP a ser pesquisado
   */
  getAddress(cep: string): Observable<ViaCepResponse> {
    return this.http.get<ViaCepResponse>(this.getUrl(cep));
  }

  /**
   * Consulta o endereço de forma assíncrona, compatível com o Signal resource().
   * @param cep CEP a ser pesquisado
   * @param signal AbortSignal para cancelamento automático
   */
  async fetchAddress(cep: string, signal?: AbortSignal): Promise<ViaCepResponse> {
    const response = await fetch(this.getUrl(cep), { signal });
    if (!response.ok) {
      throw new Error(`Falha na comunicação com a API ViaCEP (${response.status})`);
    }
    return (await response.json()) as ViaCepResponse;
  }
}
