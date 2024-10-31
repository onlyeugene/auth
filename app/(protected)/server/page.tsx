import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";
import { ExtendedUser } from "@/next-auth";

const ServerPage = async () => {
  const user = await currentUser();
  return (
      <UserInfo
            label="Server component"
            user={user as ExtendedUser | undefined}  
        />
  );
};

export default ServerPage;
