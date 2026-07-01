import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { DynamoGateway } from '@nutriplan/infrastructure/database/DynamoGateway';
import { CreateUserRequest } from '@nutriplan/types/create_user_request';
import { User } from '@nutriplan/types/user';
import { Observable, throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  private readonly tableName = process.env.USERS_TABLE || 'dev-user';

  constructor(@Inject(DynamoGateway) private readonly dynamoGateway: DynamoGateway) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  public getHello() {
    return { message: 'users health', ms: process.env.MS_NAME || 'sandbox' };
  }

  public createUser(dto: CreateUserRequest): Observable<User> {
    // 1. Check if email already exists
    return this.dynamoGateway.query<User>({
      table: this.tableName,
      index: 'emailGSI',
      field: 'email',
      value: dto.email,
    }).pipe(
      switchMap((existingUsers) => {
        if (existingUsers.length > 0) {
          return throwError(() => new ConflictException('El correo electrónico ya está registrado.'));
        }

        // 2. Hash password and build User object
        const now = new Date().toISOString();
        const newUser: User = {
          id: dto.id,
          email: dto.email,
          passwordHash: this.hashPassword(dto.password),
          nombre: dto.nombre,
          rol: dto.rol,
          fechaCreacion: now,
          fechaActualizacion: now,
        };

        // 3. Save to DynamoDB
        return this.dynamoGateway.put(newUser, this.tableName).pipe(
          map(() => {
            // Return user without passwordHash
            const { passwordHash, ...userWithoutPassword } = newUser;
            return userWithoutPassword as any;
          })
        );
      })
    );
  }

  public autenticar(email: string, password: string): Observable<boolean> {
    return this.dynamoGateway.query<User>({
      table: this.tableName,
      index: 'emailGSI',
      field: 'email',
      value: email,
    }).pipe(
      map((users) => {
        if (users.length === 0) return false;
        const user = users[0];
        return user.passwordHash === this.hashPassword(password);
      })
    );
  }
}
