import { signIn } from "@/auth";
import { Button } from "antd";

const Login = () => {
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signIn("google", {
            redirectTo: "/",
          });
        }}
      >
        <Button htmlType="submit">Signin with Google</Button>
      </form>
    </div>
  );
};

export default Login;
