import { auth } from "@/auth";
import { FindAccount } from "@/lib/Account";
import EcoCountdown from "./EcoCountdown";

const TinkTokenTime = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const account = await FindAccount("tink", Number(userId));

  if (!account) {
    return <div>No Tink access</div>;
  }

  const createdAt = new Date(account.createdAt);
  const expiredAt = account.expires_at ?? 0;

  return <EcoCountdown createdAt={createdAt} expiredAt={expiredAt} />;
};

export default TinkTokenTime;
