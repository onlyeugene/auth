'use client'

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ExtendedUser } from "@/next-auth";

const ClientPage = () => {
  const user = useCurrentUser();
  return (
      <UserInfo
            label="Client component"
            user={user as ExtendedUser | undefined}  
            
        />
  );
};

export default ClientPage;
