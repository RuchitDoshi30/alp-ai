import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyTicketDto {
  @IsString()
  @IsNotEmpty()
  bookingRef!: string;
}
