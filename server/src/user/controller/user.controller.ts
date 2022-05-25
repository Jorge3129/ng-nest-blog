import {Controller, Delete, Get, Post, Put, Body, Param} from '@nestjs/common';
import {UserService} from "../service/user.service";
import {User} from "../models/user.model";
import {from, Observable} from "rxjs";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {
    }

    @Post()
    create(@Body() user: User): Observable<User> {
        return from(this.userService.create(user));
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return from(this.userService.findOne(params.id));
    }

    @Get()
    findAll(): Observable<User[]> {
        return from(this.userService.findAll())
    }

    @Delete(':id')
    delete(@Param() params): Observable<any> {
        return from(this.userService.delete(params.id));
    }

    @Put(':id')
    updateOne(@Param() params, @Body() user: User): Observable<any> {
        return from(this.userService.updateOne(params.id, user));
    }

}
