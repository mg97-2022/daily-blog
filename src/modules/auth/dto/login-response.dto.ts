export class LoginResponseDto {
  accessToken: string;
  user: { id: string; name: string; email: string };
}
