import { IsNotEmpty } from 'class-validator';

export class SignInResponse {
  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  id: string;
}
