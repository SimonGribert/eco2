import { auth, signOut } from "@/auth";
import { Button } from "antd";

const Home = async () => {
  const session = await auth();

  console.log(session);

  return (
    <div>
      <p>hello {session?.user?.name}</p>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <Button htmlType="submit">Signout</Button>
      </form>
    </div>
  );
};

export default Home;
