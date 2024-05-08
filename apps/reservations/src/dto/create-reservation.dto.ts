import { IsDate, IsNotEmpty, IsString } from "class-validator"
import { Type } from "class-transformer"

export class CreateReservationDto {
    @IsDate()
    @Type(() => Date)   //to transorm the type from string to Date
    startDate: Date 

    @IsDate()
    @Type(() => Date)
    endDate: Date

    @IsString()
    @IsNotEmpty()
    placeId: string

    @IsString()
    @IsNotEmpty()
    invoiceId: string
}
