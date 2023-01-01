import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserDTO } from 'src/app/models/userDTO';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  userLogin: UserDTO = new UserDTO();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  login(userLogin: UserDTO) {
    this.authService.login(userLogin).subscribe((authResult) => {
      this.authService.setToken(authResult.token);
      this.authService.setRefreshToken(authResult.refreshToken);
      const tokenPayload = this.authService.decodeToken(authResult.token);
      this.userService.user.next({
        email: tokenPayload.email,
        username: tokenPayload.name,
        role: tokenPayload.role,
      });
      this.authService.isLoggedIn.next(true);
      this.router.navigate(['/']);
    });
  }
}
