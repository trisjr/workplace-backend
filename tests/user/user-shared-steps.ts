import { Mutable } from '@libs/types';
import { CreateUserRequestDto } from '@modules/user/commands/create-user/create-user.request.dto';
import { ApiClient } from '@tests/test-utils/ApiClient';
import { DefineStepFunction } from 'jest-cucumber';
import { TestContext } from 'tests/test-utils/TestContext';

/**
 * Test steps that are shared between multiple user tests
 */

export type CreateUserTestContext = {
  createUserDto: Mutable<CreateUserRequestDto>;
};

export const givenUserProfileData = (given: DefineStepFunction, ctx: TestContext<CreateUserTestContext>): void => {
  given(/^user profile data$/, (table: CreateUserRequestDto[]) => {
    ctx.context.createUserDto = table[0];
  });
};

export const iSendARequestToCreateAUser = (when: DefineStepFunction, ctx: TestContext<CreateUserTestContext>): void => {
  when('I send a request to create a user', async () => {
    const response = await new ApiClient().createUser(ctx.context.createUserDto);
    ctx.latestResponse = response;
  });
};
