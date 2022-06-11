import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serializse-interceptor';
import { ShowUserDto } from './dtos/show-user.dto';

@Controller('auth')
@Serialize<typeof ShowUserDto, User>(ShowUserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  signup(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  @Get('/:id')
  async findOneUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllEmails(@Query('email') email: string): Promise<User[]> {
    return this.usersService.findEmails(email);
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updatedUser: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(parseInt(id), updatedUser);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(parseInt(id));
  }
}
