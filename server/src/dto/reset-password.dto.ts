import { Rule, RuleType } from '@midwayjs/validate';

export class RequestResetPasswordDTO {
  @Rule(RuleType.string().required().email())
  email: string;
}

export class ResetPasswordDTO {
  @Rule(RuleType.string().required())
  token: string;

  @Rule(RuleType.string().required().min(6).max(20))
  newPassword: string;
}