import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {from, Observable} from "rxjs";
import {User} from "../../user/models/user.model";
import * as argon2 from "argon2"

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) {
    }

    generateJWT(user: User): Observable<string> {
        return from(this.jwtService.signAsync({user}))
    }

    hashPassword(password: string): Observable<string> {
        return from(argon2.hash(password))
    }

    comparePasswords(password: string, hash: string): Observable<boolean> {
        return from(argon2.verify(hash, password))
    }
}
