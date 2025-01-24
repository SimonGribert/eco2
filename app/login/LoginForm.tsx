import { signIn } from "@/auth";
import { Button, Card } from "antd";

const LoginForm = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", {
          redirectTo: "/",
        });

      }}
    >
      <Card>
        <Button htmlType="submit">Signin with Google</Button>
      </Card>
    </form>
  );
};

export default LoginForm;
