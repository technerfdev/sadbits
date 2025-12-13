import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string | null;
}
