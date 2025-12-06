import { registerEnumType } from '@nestjs/graphql';
import { PriorityType } from '@prisma/client';

registerEnumType(PriorityType, {
  name: 'PriorityType',
  description: 'Task priority levels',
});
