-- Development seed data.
-- After creating an account in the app, run in the Supabase SQL editor:
--   select public.seed_demo_data('you@example.com');
-- Dates are generated relative to now() so they stay realistic regardless of when this runs.

create or replace function public.seed_demo_data(target_email text)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  target_user uuid;
  subj_physics uuid;
  subj_math uuid;
  subj_chem uuid;
  subj_prog uuid;
  subj_beee uuid;
  subj_eng uuid;
  new_assignment uuid;
begin
  select id into target_user from auth.users where email = target_email;
  if target_user is null then
    raise exception 'No user found with email %', target_email;
  end if;

  insert into public.subjects (user_id, name, color) values
    (target_user, 'Physics', '#6366f1') returning id into subj_physics;
  insert into public.subjects (user_id, name, color) values
    (target_user, 'Mathematics', '#06b6d4') returning id into subj_math;
  insert into public.subjects (user_id, name, color) values
    (target_user, 'Chemistry', '#10b981') returning id into subj_chem;
  insert into public.subjects (user_id, name, color) values
    (target_user, 'Programming', '#8b5cf6') returning id into subj_prog;
  insert into public.subjects (user_id, name, color) values
    (target_user, 'BEEE', '#f59e0b') returning id into subj_beee;
  insert into public.subjects (user_id, name, color) values
    (target_user, 'English', '#ec4899') returning id into subj_eng;

  insert into public.assignments
    (user_id, subject_id, title, description, due_at, priority, status, estimated_minutes, progress, source)
  values
    (target_user, subj_physics, 'Chapter 5 Numericals', 'Complete textbook numericals 1-20 on rotational motion and angular momentum.', now() + interval '1 day' + interval '6 hours', 'high', 'in_progress', 120, 65, 'manual')
  returning id into new_assignment;

  insert into public.assignment_tasks (assignment_id, title, completed, position) values
    (new_assignment, 'Problems 1-5: Moment of inertia', true, 0),
    (new_assignment, 'Problems 6-12: Torque and angular acceleration', true, 1),
    (new_assignment, 'Problems 13-20: Rolling without slipping', false, 2);

  insert into public.assignments
    (user_id, subject_id, title, description, due_at, priority, status, estimated_minutes, progress, source)
  values
    (target_user, subj_math, 'Integration Worksheet', 'Problem set covering integration by parts and substitution.', now() + interval '3 days', 'medium', 'todo', 90, 0, 'manual');

  insert into public.assignments
    (user_id, subject_id, title, description, due_at, priority, status, estimated_minutes, progress, source)
  values
    (target_user, subj_chem, 'Chemical Kinetics Questions', 'Rate law derivations and half-life calculations.', now() - interval '1 day', 'high', 'todo', 60, 0, 'manual');

  insert into public.assignments
    (user_id, subject_id, title, description, due_at, priority, status, estimated_minutes, progress, source)
  values
    (target_user, subj_prog, 'C Arrays Assignment', 'Implement array-based stack and queue operations in C.', now() + interval '2 days', 'medium', 'todo', 100, 0, 'manual');

  insert into public.assignments
    (user_id, subject_id, title, description, due_at, priority, status, estimated_minutes, progress, source)
  values
    (target_user, subj_beee, 'Network Analysis Worksheet', 'Solve RLC circuit frequency response problems.', now() + interval '5 days', 'low', 'todo', 90, 0, 'manual');

  insert into public.assignments
    (user_id, subject_id, title, description, due_at, priority, status, estimated_minutes, progress, source, completed_at)
  values
    (target_user, subj_eng, 'Presentation Draft', 'Draft slides for the term project presentation.', now() - interval '2 days', 'medium', 'completed', 45, 100, 'manual', now() - interval '1 day');
end;
$$;
