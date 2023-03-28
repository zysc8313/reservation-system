import { ROLE_ADMIN } from './common/constants';
import { UserModel } from './models/user.model';

export default async function initDemoData() {
  const users = await UserModel.find({
    email: {
      $in: ['jane.doe@user1.com', 'jane.doe@user2.com', 'jane.doe@admin.com'],
    },
  });

  if (users.length === 0) {
    UserModel.create({
      email: 'jane.doe@user1.com',
      password: '111111',
    });
    UserModel.create({
      email: 'jane.doe@user2.com',
      password: '111111',
    });
    UserModel.create({
      email: 'jane.doe@admin.com',
      password: '111111',
      role: ROLE_ADMIN,
    });
  }
}
