"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";

export type UserRow = Database["public"]["Tables"]["user"]["Row"];
export type UserRowInsert = Database["public"]["Tables"]["user"]["Insert"];
export type UserRowUpdate = Database["public"]["Tables"]["user"]["Update"];

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

export async function getUsers(): Promise<UserRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("user").select("*");

  if (error) {
    handleError(error);
  }
  return data;
}

export async function createUser(user: UserRowInsert) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("user").insert({
    ...user,
    created_at: new Date().toISOString(),
  });

  if (error) {
    handleError(error);
  }
  return data;
}

export async function updateUser(user: UserRowUpdate) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("user")
    .update({
      ...user,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    handleError(error);
  }
  return data;
}

// export async function getTodos({ searchInput = "" }): Promise<TodoRow[]> {
//   const supabase = await createServerSupabaseClient();
//   const { data, error } = await supabase
//     .from("todo")
//     .select("*")
//     .like("title", `%${searchInput}%`)
//     .order("created_at", { ascending: true });

//   if (error) {
//     handleError(error);
//   }

//   return data;
// }

// export async function createTodo(todo: TodoRowInsert) {
//   const supabase = await createServerSupabaseClient();

//   const { data, error } = await supabase.from("todo").insert({
//     ...todo,
//     created_at: new Date().toISOString(),
//   });

//   if (error) {
//     handleError(error);
//   }

//   return data;
// }

// export async function updateTodo(todo: TodoRowUpdate) {
//   const supabase = await createServerSupabaseClient();
//   console.log(todo);

//   const { data, error } = await supabase
//     .from("todo")
//     .update({
//       ...todo,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("id", todo.id);

//   if (error) {
//     handleError(error);
//   }

//   return data;
// }

// export async function deleteTodo(id: number) {
//   const supabase = await createServerSupabaseClient();

//   const { data, error } = await supabase.from("todo").delete().eq("id", id);

//   if (error) {
//     handleError(error);
//   }

//   return data;
// }
