import { Rule, RuleType } from '@midwayjs/validate';

export class CreatePostDTO {
  @Rule(RuleType.string().required().max(100))
  title: string;

  @Rule(RuleType.string().required())
  content: string;

  @Rule(RuleType.string().max(255))
  coverImage?: string;

  @Rule(RuleType.array().items(RuleType.string()))
  tags?: string[];

  @Rule(RuleType.boolean())
  isPublished?: boolean;
}

export class UpdatePostDTO extends CreatePostDTO {
  @Rule(RuleType.number().required())
  id: number;
}

export class QueryPostDTO {
  @Rule(RuleType.number().min(1))
  page?: number = 1;

  @Rule(RuleType.number().min(1).max(50))
  pageSize?: number = 10;

  @Rule(RuleType.string())
  keyword?: string;

  @Rule(RuleType.array().items(RuleType.string()))
  tags?: string[];

  @Rule(RuleType.boolean())
  isPublished?: boolean;
}
