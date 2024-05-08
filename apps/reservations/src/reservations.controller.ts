import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CurrentUser, JwtAuthGuard } from '@app/common';
import { UserDto } from '@app/common/dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createReservationDto: CreateReservationDto, @CurrentUser() user: UserDto) {
    return this.reservationsService.create(createReservationDto, user._id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: UserDto) {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto, @CurrentUser() user: UserDto) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return this.reservationsService.remove(id);
  }
}
