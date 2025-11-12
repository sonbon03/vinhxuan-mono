import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    this.logger.log(`Incoming request to ${request.method} ${request.url}`);
    this.logger.log(`Authorization header: ${authHeader ? 'Present' : 'Missing'}`);

    if (!authHeader) {
      this.logger.error('No authorization header found');
      throw new UnauthorizedException('No authorization header provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
      this.logger.error('Invalid authorization header format');
      throw new UnauthorizedException('Invalid authorization header format. Expected: Bearer <token>');
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (err || !user) {
      this.logger.error(`JWT validation failed for ${request.method} ${request.url}`);
      this.logger.error(`Error: ${err?.message || 'No error'}`);
      this.logger.error(`Info: ${info?.message || 'No info'}`);
      this.logger.error(`User: ${user ? 'User object present' : 'No user object'}`);

      throw err || new UnauthorizedException(info?.message || 'Unauthorized');
    }

    this.logger.log(`JWT validation successful for user: ${user.email} (${user.role})`);
    return user;
  }
}
