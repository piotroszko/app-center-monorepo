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
import { FormCombobox, FormInput } from "@repo/ui/form-fields";
import React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "@repo/ui/components/form-fields/input/FormSelect";

const createChannelSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters long",
  }),
  description: z.string().nullish(),
  type: z.enum(["public", "private", "group"]),
  userIds: z.array(z.string()).nullish(),
});

export const CreateChannelButton = () => {
  const form = useForm<z.infer<typeof createChannelSchema>>({
    resolver: zodResolver(createChannelSchema),
  });

  function onSubmit(values: z.infer<typeof createChannelSchema>) {
    console.log("values", values);
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
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, console.log)}
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
                    value: "private",
                    label: "Private",
                  },
                  {
                    value: "group",
                    label: "Group",
                  },
                ]}
              />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
