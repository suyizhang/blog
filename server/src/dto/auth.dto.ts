import { Rule, RuleType } from '@midwayjs/validate';

export class RegisterDTO {
  @Rule(RuleType.string().required().min(4).max(20))
  username: string;

  @Rule(RuleType.string().required().email())
  email: string;

  @Rule(RuleType.string().required().min(6).max(20))
  password: string;

  @Rule(RuleType.string().max(500))
  bio?: string;

  @Rule(RuleType.string().max(255))
  avatar?: string;
}

export class LoginDTO {
  @Rule(RuleType.string().required())
  account: string;

  @Rule(RuleType.string().required())
  password: string;
}

export class UpdateUserDTO {
  @Rule(RuleType.string().min(4).max(20))
  username?: string;

  @Rule(RuleType.string().email())
  email?: string;

  @Rule(RuleType.string().min(6).max(20))
  password?: string;

  @Rule(RuleType.string().max(500))
  bio?: string;

  @Rule(RuleType.string().max(255))
  avatar?: string;
}
