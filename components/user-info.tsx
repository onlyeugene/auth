import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className="w-[600px] shadow-md ">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm">
                ID
            </p>
            <p className="truncate text-xs max-w-[180px] font-mono bg-slate-100 rounded-md p-1">{user?.id}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm">
                Name
            </p>
            <p className="truncate text-xs max-w-[180px] font-mono bg-slate-100 rounded-md p-1">{user?.name}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm">
                Email
            </p>
            <p className="truncate text-xs max-w-[180px] font-mono bg-slate-100 rounded-md p-1">{user?.email}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm">
                Role
            </p>
            <p className="truncate text-xs max-w-[180px] font-mono bg-slate-100 rounded-md p-1">{user?.role}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm">
                Two Factor Authentication
            </p>
            <Badge variant={user?.isTwoFactorEnabled ? 'success': 'destructive'}>{user?.isTwoFactorEnabled ? 'ON' : 'OFF'}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};