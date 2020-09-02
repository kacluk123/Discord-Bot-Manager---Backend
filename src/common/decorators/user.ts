import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { RequestWithUser } from '../../auth/jwt/jwt.strategy'

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<RequestWithUser>();
  return req.user
});