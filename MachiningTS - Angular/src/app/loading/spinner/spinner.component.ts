import { Component } from '@angular/core';
import { SpinnerService } from 'src/app/auth/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  constructor(private spinnerSvc: SpinnerService) { }
  isLoading$ = this.spinnerSvc.isLoading$;
}
