import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';
import { client } from '../../../utils/queryData';
import mutatingSanityContent from '../../../utils/sanityDocMutation';

const handler = nc();

handler.post(async (req, res) => {
  const createMutations = [
    {
      create: {
        _type: 'user',
        name: req.body.name,
        email: req.body.email,
        password: f.hashSync(req.body.password),
        isAdmin: false,
      },
    },
  ];
  const existUser = await client.fetch(
    `*[_type == "user" && email == $email][0]`,
    { email: req.body.email }
  );
  if (existUser) return res.status(401).send({ message: 'Email already exists' });

  const data = await mutatingSanityContent(createMutations);
  const userId = data.results[0].id;
  const user = {
    _id: userId,
    name: req.body.name,
    email: req.body.email,
    isAdmin: false,
  };
  const token = signToken(user);
  res.send({ ...user, token });
});
export default handler;