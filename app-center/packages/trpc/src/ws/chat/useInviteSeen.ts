import { useCallback, useEffect, useState } from "react";
import { InputInvite } from "./input/invite";

export const useInviteSeen = (invites: InputInvite[]) => {
  const [isNewInvites, setIsNewInvites] = useState(false);

  const setAllInvitesSeen = useCallback(() => {
    for (const invite of invites) {
      if (localStorage.getItem(`invite_${invite.id}`) === "seen") {
        continue;
      }
      localStorage.setItem(`invite_${invite.id}`, "seen");
    }
  }, [invites]);

  useEffect(() => {
    if (invites.length === 0) {
      return;
    }
    let isNew = false;
    for (const invite of invites) {
      if (localStorage.getItem(`invite_${invite.id}`) === "seen") {
        continue;
      }
      isNew = true;
      break;
    }
    setIsNewInvites(isNew);
  }, [invites]);

  return { isNewInvites, setAllInvitesSeen };
};
