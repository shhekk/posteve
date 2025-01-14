import { AuthHelper } from '@posteve/nestjs-libraries/helper/auth/auth.helper';
import { PrismaClient, User } from '@prisma/client';
import { log } from 'console';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();

const password = hashSync('user1234', 10);
const users = [
  {
    id: 'goblin',
    username: 'goblin',
    email: 'goblin@posteve.in',
    password,
    verified: true,
  },
  {
    id: 'abhishek',
    username: 'abhishek',
    email: 'abhishek@posteve.in',
    password,
    verified: true,
  },
  {
    id: 'random',
    username: 'random',
    email: 'random@posteve.in',
    password,
    verified: true,
  },
];

async function main() {
  console.log('seeding database....');
  await Promise.all(
    //Advantage: Operations are concurrent, leveraging full database performance.
    users.map((user) =>
      prisma.user.upsert({
        create: user,
        where: { email: user.email },
        update: {},
      })
    )
  );
  console.log('database seeded successfully.');
}

main()
  .catch((e) => {
    log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
