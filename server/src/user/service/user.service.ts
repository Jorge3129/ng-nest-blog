import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../models/user.entity";
import {FindConditions, FindOneOptions, Repository} from "typeorm";
import {catchError, from, map, Observable, switchMap, throwError} from "rxjs";
import {User} from "../models/user.model";
import {AuthService} from "../../auth/service/auth.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private authService: AuthService
    ) {
    }

    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((password: string) => {
                const newUser = Object.assign(new UserEntity(), {...user, password})
                return from(this.userRepo.save(newUser)).pipe(
                    map((user: User) => UserService.removePassword(user)),
                    catchError(e => throwError(e))
                )
            })
        )
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepo.findOne(id)).pipe(
            map((user: User) => UserService.removePassword(user)),
            catchError(e => throwError(e))
        );
    }

    findAll(): Observable<User[]> {
        return from(this.userRepo.find()).pipe(
            map((users: User[]) => users.map(user => UserService.removePassword(user))),
            catchError(e => throwError(e))
        );
    }

    delete(id: number): Observable<any> {
        return from(this.userRepo.delete(id));
    }

    updateOne(id: number, user: User): Observable<any> {
        return from(this.userRepo.update(id, user));
    }

    updateRoleOfUser(id: number, user: User): Observable<any> {
        return from(this.userRepo.update(id, user));
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => user ?
                this.authService.generateJWT(user).pipe(map((jwt: string) => jwt)) :
                'Wrong Credentials'
            )
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return from(this.findByEmail(email, {select: ['id', 'password', 'name', 'username', 'email']})).pipe(
            switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                    map((match: boolean) => {
                            if (match) return UserService.removePassword(user)
                            else throw new Error('Invalid credentials');
                        }
                    )
                )
            )
        )
    }

    findByEmail(email: string, options?: FindOneOptions<UserEntity>): Observable<User> {
        return from(this.userRepo.findOne({email}, options))
    }

    private static removePassword(user: User): User {
        const {password, ...result} = user;
        return result;
    }
}
