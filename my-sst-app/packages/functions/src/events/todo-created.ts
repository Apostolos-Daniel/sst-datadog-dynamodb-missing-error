import { EventHandler } from "sst/node/event-bus";
import { Todo } from "@my-sst-app/core/todo";

export const handler = EventHandler(Todo.Events.Created, async (evt) => {
  console.log("Todo created", evt);
});
