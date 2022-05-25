import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../models/user.entity";
import {Repository} from "typeorm";
import {from, Observable} from "rxjs";
import {User} from "../models/user.model";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>
    ) {}
    
    create(user: User): Observable<User> {
        return from(this.userRepo.save(user));
    }

    findAll(): Observable<User[]> {
        return from(this.userRepo.find());
    }

    delete(id: number): Observable<any> {
        return from(this.userRepo.delete(id));
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepo.findOne(id));
    }

    updateOne(id: number, user: User): Observable<any> {
        return from(this.userRepo.update(id, user));
    }
}
