"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ActionResult {
  error: string | null;
}

/**
 * Permanently deletes the signed-in user's account. Deleting the auth.users
 * row cascades (via FK "on delete cascade") through profiles, subjects,
 * assignments, assignment_tasks, and assignment_attachments, so no manual
 * table cleanup is needed. Requires SUPABASE_SERVICE_ROLE_KEY server-side —
 * this key is never sent to the client.
 */
export async function deleteAccountAction(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { error: "Account deletion isn't configured on this server yet. Contact support." };
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { error: error.message };

  await supabase.auth.signOut();
  return { error: null };
}
