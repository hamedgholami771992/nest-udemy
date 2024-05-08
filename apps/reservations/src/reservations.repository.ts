
import { AbstractRepository } from "@app/common/database/abstract.repository";
import { Injectable, Logger } from "@nestjs/common";
import { ReservationDocument } from "./models/reservation.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationDocument> {
    protected readonly logger = new Logger(ReservationsRepository.name);   //we pass name to give it some context


    constructor(@InjectModel(ReservationDocument.name) reservationModel: Model<ReservationDocument>){
        super(reservationModel)
    }
}