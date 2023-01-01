export class TokenPayload {
  name: string = '';
  email: string = '';
  iat: number = 0;
  exp: number = 0;
  role: 'Admin' | 'User' = 'User';
}
