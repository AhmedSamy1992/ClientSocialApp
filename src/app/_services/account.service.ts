import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../_modules/user';
import { map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceService);
  baseUrl = environment.apiUrl;
  currUser = signal<User | null>(null);
  roles = computed(() => {
    const user = this.currUser();
    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    }
    return [];
  })

  Login(model: any){
    return this.http.post<User>(this.baseUrl + 'account/Login', model).pipe(
      map(user => {
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
  }

  Register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if(user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }


  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currUser.set(user)
    this.likeService.getLikesIds();
    this.presenceService.createHubConnection(user);
  }

  Logout(){
    localStorage.removeItem('user');
    this.currUser.set(null);
    this.presenceService.stopHubConnection();
  }

 
  
}
