import { Injectable } from "@nestjs/common";
import { Account } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegisterUserDto } from "./user-register.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(@InjectRepository(Account) private userRepository: Repository<Account>) { };

    async findById(id: number): Promise<Account | undefined> {
        return this.userRepository.findOneBy({ id: id });
    }

    async findOne(username: string): Promise<Account | undefined> {
        return this.userRepository.findOne({ where: { username }, relations: { cameras: true, notifications: true } });
    }

    async checkIfExists(username: string, email: string): Promise<number> {
        return this.userRepository.count({ where: [{ username: username }, { email: email }] });
    }

    async create(registerUserDto: RegisterUserDto) {

        const saltOrRounds = await bcrypt.genSalt();

        registerUserDto.password = await bcrypt.hash(registerUserDto.password, saltOrRounds);

        const user = this.userRepository.create(registerUserDto);

        return this.userRepository.save(user);
    };
}