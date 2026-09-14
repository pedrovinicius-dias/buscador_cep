import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CepSearchComponent } from './cep-search.component';
import { AddressService } from '../../services/address.service';

describe('CepSearchComponent', () => {
  let component: CepSearchComponent;
  let fixture: ComponentFixture<CepSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CepSearchComponent],
      providers: [
        AddressService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CepSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty cep and invalid state', () => {
    expect(component.cepInput()).toBe('');
    expect(component.cleanCep()).toBe('');
    expect(component.isValidCep()).toBe(false);
    expect(component.canSearch()).toBe(false);
  });

  it('should format input with mask XXXXX-XXX when 8 digits are entered', () => {
    const inputElement = fixture.nativeElement.querySelector('#cep-input') as HTMLInputElement;
    inputElement.value = '01001000';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.cepInput()).toBe('01001-000');
    expect(component.cleanCep()).toBe('01001000');
    expect(component.isValidCep()).toBe(true);
    expect(component.canSearch()).toBe(true);
  });

  it('should clear input and searched state when clear() is called', () => {
    component.cepInput.set('01001-000');
    component.searchedCep.set('01001000');

    component.clear();

    expect(component.cepInput()).toBe('');
    expect(component.searchedCep()).toBe('');
    expect(component.cleanCep()).toBe('');
    expect(component.isValidCep()).toBe(false);
  });
});
