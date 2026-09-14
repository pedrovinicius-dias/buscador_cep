import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CepSearchComponent } from './components/cep-search/cep-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CepSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
