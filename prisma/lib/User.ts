import { prisma } from "../prisma";

export const Login = async (email: string, name: string, image: string) => {
  let user = await FindUser(email);

  if (!user) {
    user = await CreateUser(email, name, image);
  }

  return user;
};

export const FindUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
};

export const CreateUser = async (
  email: string,
  name: string,
  image: string
) => {
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      image,
    },
  });

  return newUser;
};
