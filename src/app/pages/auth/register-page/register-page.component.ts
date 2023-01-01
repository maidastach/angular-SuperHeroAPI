import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/models/userDTO';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {
  userRegister: UserDTO = new UserDTO();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  register(userRegister: UserDTO) {
    this.authService.register(userRegister).subscribe((authResult) => {
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
