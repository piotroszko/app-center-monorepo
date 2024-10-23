import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { PropsWithChildren } from "react";
import { trpc } from "@repo/trpc/clients/client";
import { Skeleton } from "@ui/components/ui/skeleton";
import { Button } from "@ui/components/ui/button";
import { MessageCircle } from "lucide-react";

interface Props {
  userId: string;
}
export const UserPopover = ({ children, userId }: PropsWithChildren<Props>) => {
  const {
    mutate: getUser,
    isLoading,
    data,
  } = trpc.user.getUser.useMutation({
    mutationKey: ["userGet", userId],
  });

  return (
    <Popover
      onOpenChange={() => {
        if (isLoading) return;
        getUser({ userId });
      }}
    >
      <PopoverTrigger asChild className="cursor-pointer">
        {children}
      </PopoverTrigger>
      <PopoverContent className="min-w-2">
        {isLoading || !data ? (
          <div>
            <Skeleton className="w-full h-8" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-1">
            <div className="flex flex-row gap-2 items-center justify-around">
              <Avatar className="h-8 w-8">
                <AvatarImage src={data?.id} alt={data?.name} />
                <AvatarFallback>{data?.name?.[0]}</AvatarFallback>
              </Avatar>
              <Button variant={"secondary"} className="flex flex-row gap-2">
                Send message
                <MessageCircle />
              </Button>
            </div>
            <div className="w-full bold">{data?.name}</div>
            <div className="w-full">{data?.email}</div>
            <div className="w-full italic text-secondary-foreground/50 text-xs">
              {" User since: " + new Date(data?.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
