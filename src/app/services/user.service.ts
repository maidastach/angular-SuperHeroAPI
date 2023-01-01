import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  userSource: Observable<User> = this.user.asObservable();
  constructor() {}
}
