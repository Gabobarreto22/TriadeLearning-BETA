import { supabase, type Course, type Module, type ExamQuestion, type CourseAssignment, type CourseWithRelations, type Profile, type JobRole } from './supabase';

export async function fetchCoursesForRole(jobRole: string): Promise<CourseWithRelations[]> {
  const { data: assignments, error: assignErr } = await supabase
    .from('course_assignments')
    .select('course_id')
    .eq('job_role', jobRole);

  if (assignErr) return [];

  const courseIds = (assignments ?? []).map((a) => a.course_id);
  if (courseIds.length === 0) return [];

  const { data: courses, error: courseErr } = await supabase
    .from('courses')
    .select('*')
    .in('id', courseIds)
    .order('created_at', { ascending: false });

  if (courseErr || !courses) return [];

  const { data: modules } = await supabase.from('modules').select('*').in('course_id', courseIds).order('order_index');
  const { data: questions } = await supabase.from('exam_questions').select('*').in('course_id', courseIds).order('order_index');

  return courses.map((c) => ({
    ...c,
    modules: (modules ?? []).filter((m) => m.course_id === c.id),
    exam_questions: (questions ?? []).filter((q) => q.course_id === c.id),
    assignments: [],
  })) as CourseWithRelations[];
}

export async function fetchAllCourses(): Promise<CourseWithRelations[]> {
  const { data: courses, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
  if (error || !courses) return [];

  const courseIds = courses.map((c) => c.id);
  const { data: modules } = await supabase.from('modules').select('*').in('course_id', courseIds).order('order_index');
  const { data: questions } = await supabase.from('exam_questions').select('*').in('course_id', courseIds).order('order_index');
  const { data: assignments } = await supabase.from('course_assignments').select('*').in('course_id', courseIds);

  return courses.map((c) => ({
    ...c,
    modules: (modules ?? []).filter((m) => m.course_id === c.id),
    exam_questions: (questions ?? []).filter((q) => q.course_id === c.id),
    assignments: (assignments ?? []).filter((a) => a.course_id === c.id),
  })) as CourseWithRelations[];
}

export async function fetchModuleProgress(userId: string, moduleIds: string[]) {
  if (moduleIds.length === 0) return new Map<string, boolean>();
  const { data, error } = await supabase.from('module_progress').select('*').eq('user_id', userId).in('module_id', moduleIds);
  if (error || !data) return new Map<string, boolean>();
  return new Map(data.map((p) => [p.module_id, p.completed]));
}

export async function fetchExamResults(userId: string, courseIds: string[]) {
  if (courseIds.length === 0) return [];
  const { data, error } = await supabase.from('exam_results').select('*').eq('user_id', userId).in('course_id', courseIds).order('created_at', { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function markModuleComplete(userId: string, moduleId: string) {
  const { data: existing } = await supabase.from('module_progress').select('id').eq('user_id', userId).eq('module_id', moduleId).maybeSingle();
  if (existing) {
    await supabase.from('module_progress').update({ completed: true, completed_at: new Date().toISOString() }).eq('id', existing.id);
  } else {
    await supabase.from('module_progress').insert({ user_id: userId, module_id: moduleId, completed: true, completed_at: new Date().toISOString() });
  }
}

export async function saveExamResult(userId: string, courseId: string, examType: 'direct' | 'course', score: number, passed: boolean, directFailed: boolean) {
  await supabase.from('exam_results').insert({
    user_id: userId,
    course_id: courseId,
    exam_type: examType,
    score,
    passed,
    direct_failed: directFailed,
  });
}

export async function createCourse(course: Omit<Course, 'id' | 'created_by' | 'created_at'>, modules: Omit<Module, 'id' | 'course_id' | 'created_at'>[], questions: Omit<ExamQuestion, 'id' | 'course_id'>[], assignments: Omit<CourseAssignment, 'id' | 'course_id' | 'created_at'>[], createdBy: string) {
  const { data: courseData, error: courseErr } = await supabase.from('courses').insert({ ...course, created_by: createdBy }).select().single();
  if (courseErr || !courseData) return { error: courseErr?.message ?? 'Error creating course' };

  const courseId = courseData.id;

  if (modules.length > 0) {
    const { error: modErr } = await supabase.from('modules').insert(modules.map((m, i) => ({ ...m, course_id: courseId, order_index: i })));
    if (modErr) return { error: modErr.message };
  }

  if (questions.length > 0) {
    const { error: qErr } = await supabase.from('exam_questions').insert(questions.map((q, i) => ({ ...q, course_id: courseId, order_index: i })));
    if (qErr) return { error: qErr.message };
  }

  if (assignments.length > 0) {
    const { error: aErr } = await supabase.from('course_assignments').insert(assignments.map((a) => ({ ...a, course_id: courseId })));
    if (aErr) return { error: aErr.message };
  }

  return { error: null };
}

export async function deleteCourse(courseId: string) {
  const { error } = await supabase.from('courses').delete().eq('id', courseId);
  return { error: error?.message ?? null };
}

export async function fetchAllProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data;
}

// ===================== JOB ROLES =====================
export async function fetchJobRoles(): Promise<JobRole[]> {
  const { data, error } = await supabase.from('job_roles').select('*').order('name', { ascending: true });
  if (error || !data) return [];
  return data;
}

export async function createJobRole(name: string, description: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('job_roles').insert({ name, description });
  return { error: error?.message ?? null };
}

export async function updateJobRole(id: string, name: string, description: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('job_roles').update({ name, description }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteJobRole(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('job_roles').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ===================== PROFILE MANAGEMENT =====================
export async function updateProfile(id: string, updates: Partial<Pick<Profile, 'full_name' | 'job_role' | 'role'>>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteProfile(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ===================== COURSE ASSIGNMENTS BY ROLE =====================
export async function fetchAssignmentsByRole(jobRole: string) {
  const { data, error } = await supabase
    .from('course_assignments')
    .select('*, courses(id, title)')
    .eq('job_role', jobRole)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function assignCourseToRole(courseId: string, jobRole: string, deadline: string | null): Promise<{ error: string | null }> {
  const { error } = await supabase.from('course_assignments').insert({ course_id: courseId, job_role: jobRole, deadline });
  return { error: error?.message ?? null };
}

export async function removeAssignment(assignmentId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('course_assignments').delete().eq('id', assignmentId);
  return { error: error?.message ?? null };
}

export async function updateAssignment(assignmentId: string, deadline: string | null): Promise<{ error: string | null }> {
  const { error } = await supabase.from('course_assignments').update({ deadline }).eq('id', assignmentId);
  return { error: error?.message ?? null };
}
