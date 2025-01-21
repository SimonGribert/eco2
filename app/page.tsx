import { auth, signIn } from "@/auth";
import { Button } from "antd";

const Home = async () => {
  const session = await auth();

  console.log(session);

  return (
    <div>
      <Button type="primary">Button</Button>

      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit">Signin with Google</button>
      </form>
    </div>
  );
};

export default Home;
