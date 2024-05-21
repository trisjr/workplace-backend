import { IdResponse } from '@libs/api/id.response.dto';
import { UserResponseDto } from '@modules/user/dtos/user.response.dto';
import { ApiClient } from '@tests/test-utils/ApiClient';
import { TestContext } from '@tests/test-utils/TestContext';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { DatabasePool, sql } from 'slonik';
import { getConnectionPool } from '../../setup/jestSetupAfterEnv';
import { CreateUserTestContext, givenUserProfileData, iSendARequestToCreateAUser } from '../user-shared-steps';

const feature = loadFeature('tests/user/delete-user/delete-user.feature');

defineFeature(feature, (test) => {
  let pool: DatabasePool;
  const apiClient = new ApiClient();

  beforeAll(() => {
    pool = getConnectionPool();
  });

  afterEach(async () => {
    await pool.query(sql.unsafe`TRUNCATE "users"`);
  });

  test('I can delete a user', ({ given, when, then, and }) => {
    const ctx = new TestContext<CreateUserTestContext>();

    givenUserProfileData(given, ctx);

    iSendARequestToCreateAUser(when, ctx);

    then('I send a request to delete my user', async () => {
      const response = ctx.latestResponse as IdResponse;
      await apiClient.deleteUser(response.id);
    });

    and('I cannot see my user in a list of all users', async () => {
      const res = await apiClient.findAllUsers();
      const response = ctx.latestResponse as IdResponse;
      expect(res.data.some((item: UserResponseDto) => item.id === response.id)).toBe(false);
    });
  });
});
