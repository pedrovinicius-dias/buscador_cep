import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AddressService } from './address.service';
import { ViaCepResponse } from '../models/address.model';

describe('AddressService', () => {
  let service: AddressService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddressService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AddressService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate correct ViaCEP URL for masked and unmasked CEPs', () => {
    expect(service.getUrl('01001-000')).toBe('https://viacep.com.br/ws/01001000/json/');
    expect(service.getUrl('01001000')).toBe('https://viacep.com.br/ws/01001000/json/');
    expect(service.getUrl(' 01.001-000 ')).toBe('https://viacep.com.br/ws/01001000/json/');
  });

  it('should perform GET request for address data', () => {
    const mockResponse: ViaCepResponse = {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP'
    };

    service.getAddress('01001000').subscribe((data) => {
      expect(data).toEqual(mockResponse);
      expect(data.localidade).toBe('São Paulo');
    });

    const req = httpTesting.expectOne('https://viacep.com.br/ws/01001000/json/');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
