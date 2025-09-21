import { Resolver, Query, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AppInfo {
  @Field()
  name: string;

  @Field()
  version: string;

  @Field()
  status: string;

  @Field()
  timestamp: string;
}

@Resolver()
export class AppResolver {
  @Query(() => AppInfo)
  appInfo(): AppInfo {
    return {
      name: 'Core API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }

  @Query(() => String)
  hello(): string {
    return 'Hello from Core API!';
  }
}