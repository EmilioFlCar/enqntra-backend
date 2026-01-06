import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

/*   @Roles('ADMIN') */
  @Get()
  async () {
    return this.userService.findAllUsers();
  }
}
