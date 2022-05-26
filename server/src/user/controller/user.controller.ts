import {Controller, Delete, Get, Post, Put, Body, Param, UseGuards} from '@nestjs/common';
import {UserService} from "../service/user.service";
import {User, UserRole} from "../models/user.model";
import {catchError, from, map, Observable, of} from "rxjs";
import {JwtAuthGuard} from "../../auth/guards/jwt-guard";
import {hasRoles} from "../../auth/decorators/hasRoles";
import {RolesGuard} from "../../auth/guards/roles.guard";
import {CheckUserGuard} from "../../auth/guards/checkUser.guard";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {
    }

    @Post()
    create(@Body() user: User): Observable<User | {error: any}> {
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt };
            })
        )
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return from(this.userService.findOne(params.id));
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll(): Observable<User[]> {
        return from(this.userService.findAll())
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    delete(@Param() params): Observable<any> {
        return from(this.userService.delete(params.id));
    }

    @UseGuards(JwtAuthGuard, CheckUserGuard)
    @Put(':id')
    updateOne(@Param() params, @Body() user: User): Observable<any> {
        return from(this.userService.updateOne(params.id, user));
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.userService.updateRoleOfUser(Number(id), user);
    }

}
