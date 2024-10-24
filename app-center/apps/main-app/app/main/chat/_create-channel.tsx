"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Form } from "@repo/ui/components/ui/form";
import { FormInput, FormMultiSelector } from "@repo/ui/form-fields";
import React, { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "@repo/ui/components/form-fields/input/FormSelect";
import { trpc } from "@repo/trpc/clients/client";
import { useGetUser } from "../../auth/login/_form";

const createChannelSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters long",
  }),
  description: z.string().nullish(),
  type: z.enum(["public", "private", "group"]),
  userIds: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .nullish(),
});

export const CreateChannelButton = () => {
  const { id } = useGetUser();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);

  const { data } = trpc.user.getUsers.useQuery({
    page,
    nameFragment: searchValue,
  });

  const form = useForm<z.infer<typeof createChannelSchema>>({
    resolver: zodResolver(createChannelSchema),
  });

  function onSubmit(values: z.infer<typeof createChannelSchema>) {
    console.log("values", values);
  }

  function onGetMore() {
    if (data?.length !== 50 * (page + 1)) {
      return;
    }
    setPage((prev) => prev + 1);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            form.reset();
          }}
          variant={"secondary"}
        >
          Create channel
        </Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => {
          if (isSelectOpen) e.preventDefault();
        }}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="gap-6 flex flex-col"
          >
            <DialogHeader>
              <DialogTitle>Create channel</DialogTitle>
              <DialogDescription>
                Create a new channel to chat with your friends
              </DialogDescription>
            </DialogHeader>
            <div className="grid w-full items-center gap-1.5">
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                className="mb-4"
                placeholder="My amazing channel"
                type="text"
              />
              <FormInput
                control={form.control}
                name="description"
                label="Description"
                className="mb-4"
                placeholder="A channel for amazing people"
                type="text"
              />
              <FormSelect
                label="Channel type"
                control={form.control}
                name="type"
                className="mb-4"
                defaultValue="public"
                options={[
                  {
                    value: "public",
                    label: "Public",
                  },
                  {
                    value: "group",
                    label: "Group",
                  },
                ]}
              />
              <FormMultiSelector
                control={form.control}
                className="mb-20"
                name="userIds"
                options={
                  data
                    ?.map((user) => ({
                      value: user.id,
                      label: user.name,
                    }))
                    .filter(
                      (user) => user.value !== id && user.value !== "1",
                    ) || []
                }
                onLastItemSeen={() => {
                  onGetMore();
                }}
                onSearchSync={(search) => {
                  setSearchValue(search);
                  setPage(() => 0);
                  return [];
                }}
                inputProps={{
                  onFocus: () => {
                    setIsSelectOpen(true);
                  },
                  onBlur: () => {
                    setIsSelectOpen(false);
                  },
                }}
              />
              <div className="flex flex-col gap-2"></div>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
