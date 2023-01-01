import { Component } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  isLoggedIn: boolean = false;
  username: string = '';
  role: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedInSource.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.userService.userSource.subscribe((user) => {
      this.username = user.username;
      this.role = user.role;
    });
  }
}
