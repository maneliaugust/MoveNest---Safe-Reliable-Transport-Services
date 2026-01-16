import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'mn-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <mn-navbar />
    <main>
      <router-outlet />
    </main>
    <mn-footer />
  `,
  styles: [`
    main {
      min-height: calc(100vh - 200px);
    }
  `],
})
export class App { }
