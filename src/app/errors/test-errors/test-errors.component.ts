import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {
  
  private http = inject(HttpClient);
  baseUrl = "https://localhost:7234/api/";
  validationsErrors: string[] = [];

  test500Error(){
     this.http.get(this.baseUrl + 'users/server-error').subscribe({
      next: respnse => console.log(respnse),
      error: error => console.log(error)
     })
  }

  test4ValidationForRegister00Error(){
    this.http.post(this.baseUrl + 'account/register', {}).subscribe({
     next: respnse => console.log(respnse),
     error: error => 
      {
        console.log(error);
        this.validationsErrors = error;
      }
    })
 }


 test404NotFound(){
  this.http.get(this.baseUrl + 'users/not-found').subscribe({
    next: respnse => console.log(respnse),
    error: error => console.log(error)
   })
 }

}
