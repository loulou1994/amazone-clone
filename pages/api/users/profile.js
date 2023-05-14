import nc from "next-connect";
import bcrypt from "bcryptjs";

import { client } from "../../../utils/queryData";
import { isAuth } from "../../../utils/auth";
import mutatingSanityContent from "../../../utils/sanityDocMutation";

const handler = nc();

handler.use(isAuth);
handler.put(async (req, res) => {
  const validUser = await client.fetch(
    `*[_type == "user" && email == $email && name == $name][0]`,
    { email: req.body.email, name: req.body.name }
  );
  if (validUser) {
    const createMutations = [
      {
        patch: {
          id: req.body.id,
          set: {
            password: bcrypt.hashSync(req.body.password),
          },
        },
      },
    ];
    await mutatingSanityContent(createMutations);
    return res.send();
  }
  return res.status(401).send({ message: "invalid name or email inserted" });
});
export default handler;