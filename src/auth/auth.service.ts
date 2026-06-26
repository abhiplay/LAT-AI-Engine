import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async login(credential: string, password: string) {
    const isEmail = credential.includes('@');
    const user = isEmail
      ? await this.userService.findByEmail(credential)
      : await this.userService.findByRollId(credential.toUpperCase());

    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await this.userService.validatePassword(user, password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account is inactive');

    const roleName = user.role?.name ?? 'student';

    const payload = {
      sub: user.id, email: user.email, role: roleName,
      roleId: user.roleId, roleName,
      name: user.name, regionId: user.regionId, schoolId: user.schoolId,
      gradeId: user.gradeId, gradeName: user.gradeName, rollId: user.rollId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id, name: user.name, email: user.email,
        role: roleName, roleId: user.roleId,
        regionId: user.regionId, schoolId: user.schoolId,
        gradeId: user.gradeId, gradeName: user.gradeName, rollId: user.rollId,
      },
    };
  }
}
