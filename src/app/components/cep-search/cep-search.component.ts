import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../services/address.service';
import { ViaCepResponse } from '../../models/address.model';

@Component({
  selector: 'app-cep-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cep-search.component.html',
  styleUrl: './cep-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CepSearchComponent {
  private readonly addressService = inject(AddressService);

  readonly cepInput = signal<string>('');
  readonly searchedCep = signal<string>('');
  readonly copyFeedback = signal<boolean>(false);

  readonly cleanCep = computed(() => this.cepInput().replace(/\D/g, ''));
  readonly isValidCep = computed(() => this.cleanCep().length === 8);
  readonly canSearch = computed(() => this.isValidCep() && !this.addressResource.isLoading());

  readonly validationHelper = computed(() => {
    const raw = this.cleanCep();
    if (raw.length === 0) return '';
    if (raw.length < 8) return `Restam ${8 - raw.length} dígito(s)`;
    return '';
  });

  readonly addressResource = resource<ViaCepResponse | undefined, string>({
    params: () => this.searchedCep(),
    loader: async ({ params: cep, abortSignal }) => {
      if (!cep || cep.length !== 8) {
        return undefined;
      }
      return this.addressService.fetchAddress(cep, abortSignal);
    }
  });

  readonly isNotFound = computed(() => {
    const data = this.addressResource.value();
    if (!data) return false;
    return Boolean(data.erro === true || (data.erro as unknown) === 'true');
  });

  readonly addressData = computed(() => {
    const data = this.addressResource.value();
    if (!data || data.erro) return null;
    return data;
  });

  readonly formattedResultCep = computed(() => {
    const addr = this.addressData();
    if (!addr?.cep) return '';
    const raw = addr.cep.replace(/\D/g, '');
    return raw.length === 8 ? `${raw.slice(0, 5)}-${raw.slice(5, 8)}` : addr.cep;
  });

  onCepInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const rawDigits = target.value.replace(/\D/g, '').slice(0, 8);
    const formatted = rawDigits.length > 5
      ? `${rawDigits.slice(0, 5)}-${rawDigits.slice(5, 8)}`
      : rawDigits;
    this.cepInput.set(formatted);
  }

  search(): void {
    if (!this.isValidCep() || this.addressResource.isLoading()) {
      return;
    }
    const targetCep = this.cleanCep();
    if (this.searchedCep() === targetCep) {
      this.addressResource.reload();
    } else {
      this.searchedCep.set(targetCep);
    }
  }

  clear(): void {
    this.cepInput.set('');
    this.searchedCep.set('');
  }

  async copyAddress(): Promise<void> {
    const data = this.addressData();
    if (!data) return;

    const fullAddress = [
      data.logradouro,
      data.complemento,
      data.bairro,
      `${data.localidade} - ${data.uf}`,
      `CEP: ${data.cep}`
    ]
      .filter(Boolean)
      .join(', ');

    try {
      await navigator.clipboard.writeText(fullAddress);
      this.copyFeedback.set(true);
      setTimeout(() => this.copyFeedback.set(false), 2000);
    } catch {
      console.warn('Área de transferência inacessível');
    }
  }
}
