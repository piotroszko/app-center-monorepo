"use client";

import { IInputChannel, InputUser, useChat } from "@repo/trpc/ws";
import { Button } from "@repo/ui/components/ui/button";
import { AvatarComponent } from "@repo/ui/custom";
import { useRef } from "react";

interface channelProps {
  channel: IInputChannel;
}

export const ChannelItem = ({ channel }: channelProps) => {
  const { setCurrentChannel, channels } = useChat();
  const userId = useRef(localStorage.getItem("userId") || "");
  const isPrivate =
    channel.channelType === "private" && channel.users?.length === 2;
  const isPublic = channel.channelType === "public";
  const isGroup = channel.channelType === "group";

  const currentUser = isPrivate
    ? channel.users?.find((user) => user.id === userId.current)
    : null;
  const otherUser = isPrivate
    ? channel.users?.find((user) => user.id !== userId.current)
    : null;

  return (
    <Button
      key={channel.id}
      variant="ghost"
      className="w-full justify-start mb-1 ml-1 gap-2"
      onClick={() => {
        const foundChannel = channels.find(
          (channel) => channel.id === channel.id,
        );
        if (foundChannel) {
          setCurrentChannel?.(foundChannel);
        } else {
          console.error("Channel not found", channel.id);
        }
      }}
    >
      {isPrivate && <PrivateAvatar user={currentUser} otherUser={otherUser} />}
      {isGroup && <GroupAvatar users={channel?.users} />}
      {isPublic && (
        <AvatarComponent
          className="h-8 w-8 mr-1"
          src={channel.id}
          alt={channel.name}
          fallback={channel?.name[0] || ""}
        />
      )}
      {isPrivate ? otherUser?.name : channel.name}
    </Button>
  );
};

const PrivateAvatar = ({
  user,
  otherUser,
}: {
  user?: InputUser | null;
  otherUser?: InputUser | null;
}) => {
  return (
    <div className="flex flex-row mr-1 items-center">
      <AvatarComponent
        className="h-8 w-8"
        src={user?.id}
        alt={user?.name}
        fallback={user?.name?.[0]}
      />
      {"-"}
      <AvatarComponent
        className="h-8 w-8"
        src={otherUser?.id}
        alt={otherUser?.name}
        fallback={otherUser?.name?.[0]}
      />
    </div>
  );
};

const GroupAvatar = ({ users }: { users: InputUser[] }) => {
  return (
    <div className="grid grid-grid-flow-col grid-cols-3 border border-secondary p-1 rounded-lg">
      {users
        ?.slice(0, 6)
        .map((user) => (
          <AvatarComponent
            key={user.id}
            className="h-4 w-4 text-[8px]"
            src={user.id}
            alt={user.name}
            fallback={(user?.name?.[0] || "") + (user?.name?.[1] || "")}
          />
        ))}
    </div>
  );
};
