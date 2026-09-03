import { supabase, type Course, type Module, type ExamQuestion, type CourseAssignment, type CourseWithRelations, type Profile, type JobRole, type Department, type UserJobRoleHistory, type Resource, type CoursePrerequisite, type UserCourseRequirement, type ModuleProgress, type ExamAttempt, type Certificate, type RoleCertification, type Notification, type CourseFeedback, type Badge, type UserBadge, type SystemSetting, type AuditLog } from './supabase';

// ===================== COURSES =====================
export async function fetchCoursesForRole(jobRole: string): Promise<CourseWithRelations[]> {
  const { data: assignments, error: assignErr } = await supabase
    .from('course_assignments')
    .select('course_id')
    .eq('job_role', jobRole);
  if (assignErr) return [];
  const courseIds = (assignments ?? []).map((a) => a.course_id);
  if (courseIds.length === 0) return [];
  return fetchCoursesByIds(courseIds);
}

export async function fetchAllCourses(): Promise<CourseWithRelations[]> {
  const { data: courses, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
  if (error || !courses) return [];
  return enrichCourses(courses as Course[]);
}

export async function fetchCoursesByIds(courseIds: string[]): Promise<CourseWithRelations[]> {
  const { data: courses, error } = await supabase.from('courses').select('*').in('id', courseIds).order('created_at', { ascending: false });
  if (error || !courses) return [];
  return enrichCourses(courses as Course[]);
}

async function enrichCourses(courses: Course[]): Promise<CourseWithRelations[]> {
  if (courses.length === 0) return [];
  const courseIds = courses.map((c) => c.id);
  const [modulesRes, questionsRes, assignmentsRes, resourcesRes, prereqsRes] = await Promise.all([
    supabase.from('modules').select('*').in('course_id', courseIds).order('order_index'),
    supabase.from('exam_questions').select('*').in('course_id', courseIds).order('order_index'),
    supabase.from('course_assignments').select('*').in('course_id', courseIds),
    supabase.from('resources').select('*').in('course_id', courseIds).order('order_index'),
    supabase.from('course_prerequisites').select('*').in('course_id', courseIds),
  ]);
  return courses.map((c) => ({
    ...c,
    modules: ((modulesRes.data ?? []) as Module[]).filter((m) => m.course_id === c.id),
    exam_questions: ((questionsRes.data ?? []) as ExamQuestion[]).filter((q) => q.course_id === c.id),
    assignments: ((assignmentsRes.data ?? []) as CourseAssignment[]).filter((a) => a.course_id === c.id),
    resources: ((resourcesRes.data ?? []) as Resource[]).filter((r) => r.course_id === c.id),
    prerequisites: ((prereqsRes.data ?? []) as CoursePrerequisite[]).filter((p) => p.course_id === c.id),
  })) as CourseWithRelations[];
}

export async function createCourse(course: Partial<Course>, modules: Partial<Module>[], questions: Partial<ExamQuestion>[], assignments: Partial<CourseAssignment>[], resources: Partial<Resource>[], createdBy: string) {
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
  if (resources.length > 0) {
    const { error: rErr } = await supabase.from('resources').insert(resources.map((r, i) => ({ ...r, course_id: courseId, order_index: i })));
    if (rErr) return { error: rErr.message };
  }
  return { error: null };
}

export async function deleteCourse(courseId: string) {
  const { error } = await supabase.from('courses').delete().eq('id', courseId);
  return { error: error?.message ?? null };
}

export async function updateCourse(courseId: string, updates: Partial<Course>) {
  const { error } = await supabase.from('courses').update(updates).eq('id', courseId);
  return { error: error?.message ?? null };
}

// ===================== MODULES =====================
export async function createModule(module: Partial<Module>): Promise<{ error: string | null; data: Module | null }> {
  const { data, error } = await supabase.from('modules').insert(module).select().single();
  return { error: error?.message ?? null, data: data as Module | null };
}

export async function updateModule(moduleId: string, updates: Partial<Module>) {
  const { error } = await supabase.from('modules').update(updates).eq('id', moduleId);
  return { error: error?.message ?? null };
}

export async function deleteModule(moduleId: string) {
  const { error } = await supabase.from('modules').delete().eq('id', moduleId);
  return { error: error?.message ?? null };
}

export async function reorderModules(courseId: string, moduleIds: string[]) {
  for (let i = 0; i < moduleIds.length; i++) {
    await supabase.from('modules').update({ order_index: i }).eq('id', moduleIds[i]);
  }
  return { error: null };
}

// ===================== RESOURCES =====================
export async function fetchResourcesForCourse(courseId: string): Promise<Resource[]> {
  const { data, error } = await supabase.from('resources').select('*').eq('course_id', courseId).order('order_index');
  if (error || !data) return [];
  return data as Resource[];
}

export async function createResource(resource: Partial<Resource>) {
  const { error } = await supabase.from('resources').insert(resource);
  return { error: error?.message ?? null };
}

export async function deleteResource(resourceId: string) {
  const { error } = await supabase.from('resources').delete().eq('id', resourceId);
  return { error: error?.message ?? null };
}

// ===================== EXAM QUESTIONS =====================
export async function createExamQuestion(question: Partial<ExamQuestion>) {
  const { error } = await supabase.from('exam_questions').insert(question);
  return { error: error?.message ?? null };
}

export async function deleteExamQuestion(questionId: string) {
  const { error } = await supabase.from('exam_questions').delete().eq('id', questionId);
  return { error: error?.message ?? null };
}

// ===================== PROFILES =====================
export async function fetchAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Profile[];
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteProfile(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ===================== DEPARTMENTS =====================
export async function fetchDepartments(): Promise<Department[]> {
  const { data, error } = await supabase.from('departments').select('*').order('name', { ascending: true });
  if (error || !data) return [];
  return data as Department[];
}

export async function createDepartment(name: string, code: string, description: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('departments').insert({ name, code, description });
  return { error: error?.message ?? null };
}

export async function updateDepartment(id: string, updates: Partial<Department>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('departments').update(updates).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteDepartment(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('departments').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ===================== JOB ROLES =====================
export async function fetchJobRoles(): Promise<JobRole[]> {
  const { data, error } = await supabase.from('job_roles').select('*').order('name', { ascending: true });
  if (error || !data) return [];
  return data as JobRole[];
}

export async function createJobRole(name: string, description: string, departmentId?: string | null): Promise<{ error: string | null }> {
  const { error } = await supabase.from('job_roles').insert({ name, description, department_id: departmentId ?? null });
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

// ===================== USER JOB ROLE HISTORY =====================
export async function fetchUserJobRoleHistory(userId: string): Promise<(UserJobRoleHistory & { job_role?: JobRole })[]> {
  const { data, error } = await supabase
    .from('user_job_roles_history')
    .select('*, job_role:job_roles(*)')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });
  if (error || !data) return [];
  return data as (UserJobRoleHistory & { job_role?: JobRole })[];
}

export async function changeUserRole(userId: string, newJobRoleId: string, reason: string, createdBy: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('user_job_roles_history').insert({
    user_id: userId,
    job_role_id: newJobRoleId,
    start_date: new Date().toISOString().slice(0, 10),
    is_current: true,
    reason,
    created_by: createdBy,
  });
  if (error) return { error: error.message };
  await supabase.from('user_job_roles_history').update({ end_date: new Date().toISOString().slice(0, 10), is_current: false }).eq('user_id', userId).neq('job_role_id', newJobRoleId).eq('is_current', true);
  await supabase.from('profiles').update({ job_role_id: newJobRoleId, current_role_since: new Date().toISOString().slice(0, 10) }).eq('id', userId);
  return { error: null };
}

// ===================== COURSE ASSIGNMENTS =====================
export async function fetchAssignmentsByRole(jobRoleId: string) {
  const { data, error } = await supabase
    .from('course_assignments')
    .select('*, courses(id, title), job_roles(id, name)')
    .eq('job_role_id', jobRoleId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function assignCourseToRole(courseId: string, jobRoleId: string, isMandatory: boolean, priority: string, deadlineDays: number | null, orderIndex: number): Promise<{ error: string | null }> {
  const { error } = await supabase.from('course_assignments').insert({
    course_id: courseId,
    job_role_id: jobRoleId,
    is_mandatory: isMandatory,
    priority,
    completion_deadline_days: deadlineDays,
    order_index: orderIndex,
  });
  return { error: error?.message ?? null };
}

export async function removeAssignment(assignmentId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('course_assignments').delete().eq('id', assignmentId);
  return { error: error?.message ?? null };
}

export async function updateAssignment(assignmentId: string, updates: Partial<CourseAssignment>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('course_assignments').update(updates).eq('id', assignmentId);
  return { error: error?.message ?? null };
}

// ===================== USER COURSE REQUIREMENTS =====================
export async function fetchUserCourseRequirements(): Promise<(UserCourseRequirement & { user?: Profile; course?: Course; job_role?: JobRole })[]> {
  const { data, error } = await supabase
    .from('user_course_requirements')
    .select('*, user:profiles(*), course:courses(*), job_role:job_roles(*)')
    .order('assigned_at', { ascending: false });
  if (error || !data) return [];
  return data as (UserCourseRequirement & { user?: Profile; course?: Course; job_role?: JobRole })[];
}

export async function assignCourseToUser(userId: string, courseId: string, jobRoleId: string, deadline: string | null, priority: string, isMandatory: boolean, assignedBy: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('user_course_requirements').insert({
    user_id: userId,
    course_id: courseId,
    job_role_id: jobRoleId,
    deadline,
    priority,
    is_mandatory: isMandatory,
    assigned_by: assignedBy,
  });
  return { error: error?.message ?? null };
}

// ===================== MODULE PROGRESS =====================
export async function fetchModuleProgress(userId: string, moduleIds: string[]) {
  if (moduleIds.length === 0) return new Map<string, boolean>();
  const { data, error } = await supabase.from('module_progress').select('*').eq('user_id', userId).in('module_id', moduleIds);
  if (error || !data) return new Map<string, boolean>();
  return new Map(data.map((p) => [p.module_id, p.completed]));
}

export async function fetchAllModuleProgress(): Promise<ModuleProgress[]> {
  const { data, error } = await supabase.from('module_progress').select('*');
  if (error || !data) return [];
  return data as ModuleProgress[];
}

export async function markModuleComplete(userId: string, moduleId: string) {
  const { data: existing } = await supabase.from('module_progress').select('id').eq('user_id', userId).eq('module_id', moduleId).maybeSingle();
  if (existing) {
    await supabase.from('module_progress').update({ completed: true, completed_at: new Date().toISOString() }).eq('id', existing.id);
  } else {
    await supabase.from('module_progress').insert({ user_id: userId, module_id: moduleId, completed: true, completed_at: new Date().toISOString() });
  }
}

// ===================== EXAM RESULTS =====================
export async function fetchExamResults(userId: string, courseIds: string[]) {
  if (courseIds.length === 0) return [];
  const { data, error } = await supabase.from('exam_results').select('*').eq('user_id', userId).in('course_id', courseIds).order('created_at', { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function fetchAllExamAttempts(): Promise<ExamAttempt[]> {
  const { data, error } = await supabase.from('exam_attempts').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as ExamAttempt[];
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

// ===================== CERTIFICATES =====================
export async function fetchAllCertificates(): Promise<(Certificate & { user_course_requirement?: UserCourseRequirement & { user?: Profile; course?: Course } })[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, user_course_requirement:user_course_requirements(*, user:profiles(*), course:courses(*))')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as (Certificate & { user_course_requirement?: UserCourseRequirement & { user?: Profile; course?: Course } })[];
}

// ===================== ROLE CERTIFICATIONS =====================
export async function fetchRoleCertifications(): Promise<(RoleCertification & { user?: Profile; job_role?: JobRole })[]> {
  const { data, error } = await supabase
    .from('role_certifications')
    .select('*, user:profiles(*), job_role:job_roles(*)')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as (RoleCertification & { user?: Profile; job_role?: JobRole })[];
}

// ===================== NOTIFICATIONS =====================
export async function fetchAllNotifications(): Promise<(Notification & { user?: Profile })[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*, user:profiles(*)')
    .order('sent_at', { ascending: false });
  if (error || !data) return [];
  return data as (Notification & { user?: Profile })[];
}

export async function createNotification(notification: Partial<Notification>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('notifications').insert(notification);
  return { error: error?.message ?? null };
}

export async function deleteNotification(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('notifications').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ===================== COURSE FEEDBACK =====================
export async function fetchAllFeedback(): Promise<(CourseFeedback & { user_course_requirement?: UserCourseRequirement & { user?: Profile; course?: Course } })[]> {
  const { data, error } = await supabase
    .from('course_feedback')
    .select('*, user_course_requirement:user_course_requirements(*, user:profiles(*), course:courses(*))')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as (CourseFeedback & { user_course_requirement?: UserCourseRequirement & { user?: Profile; course?: Course } })[];
}

// ===================== BADGES =====================
export async function fetchBadges(): Promise<Badge[]> {
  const { data, error } = await supabase.from('badges').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Badge[];
}

export async function createBadge(badge: Partial<Badge>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('badges').insert(badge);
  return { error: error?.message ?? null };
}

export async function deleteBadge(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('badges').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function fetchUserBadges(): Promise<(UserBadge & { user?: Profile; badge?: Badge })[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*, user:profiles(*), badge:badges(*)')
    .order('earned_at', { ascending: false });
  if (error || !data) return [];
  return data as (UserBadge & { user?: Profile; badge?: Badge })[];
}

// ===================== SYSTEM SETTINGS =====================
export async function fetchSystemSettings(): Promise<SystemSetting[]> {
  const { data, error } = await supabase.from('system_settings').select('*').order('category', { ascending: true });
  if (error || !data) return [];
  return data as SystemSetting[];
}

export async function updateSystemSetting(id: string, value: Record<string, unknown>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('system_settings').update({ value, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function createSystemSetting(key: string, value: Record<string, unknown>, description: string, category: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('system_settings').insert({ key, value, description, category });
  return { error: error?.message ?? null };
}

// ===================== AUDIT LOGS =====================
export async function fetchAuditLogs(limit = 100): Promise<(AuditLog & { user?: Profile })[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*, user:profiles(*)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as (AuditLog & { user?: Profile })[];
}

// ===================== COURSE PREREQUISITES =====================
export async function addPrerequisite(courseId: string, prerequisiteCourseId: string, isMandatory: boolean): Promise<{ error: string | null }> {
  const { error } = await supabase.from('course_prerequisites').insert({ course_id: courseId, prerequisite_course_id: prerequisiteCourseId, is_mandatory: isMandatory });
  return { error: error?.message ?? null };
}

export async function removePrerequisite(prereqId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('course_prerequisites').delete().eq('id', prereqId);
  return { error: error?.message ?? null };
}

// ===================== EMPLOYEE: NOTIFICATIONS =====================
export async function fetchNotificationsForUser(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('sent_at', { ascending: false });
  if (error || !data) return [];
  return data as Notification[];
}

export async function markNotificationAsRead(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('notifications').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function markAllNotificationsAsRead(userId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('notifications').update({ is_read: true, read_at: new Date().toISOString() }).eq('user_id', userId).eq('is_read', false);
  return { error: error?.message ?? null };
}

// ===================== EMPLOYEE: BADGES =====================
export async function fetchUserBadgesForUser(userId: string): Promise<(UserBadge & { badge?: Badge })[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*, badge:badges(*)')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });
  if (error || !data) return [];
  return data as (UserBadge & { badge?: Badge })[];
}

// ===================== EMPLOYEE: FEEDBACK =====================
export async function fetchFeedbackForUser(userId: string): Promise<CourseFeedback[]> {
  const { data, error } = await supabase
    .from('course_feedback')
    .select('*, user_course_requirement:user_course_requirements!inner(user_id)')
    .eq('user_course_requirement.user_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as CourseFeedback[];
}

export async function saveCourseFeedback(
  userCourseRequirementId: string,
  rating: number,
  feedbackText: string | null,
  wouldRecommend: boolean | null,
  difficultyLevel: string | null,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('course_feedback').insert({
    user_course_requirement_id: userCourseRequirementId,
    rating,
    feedback_text: feedbackText,
    would_recommend: wouldRecommend,
    difficulty_level: difficultyLevel,
  });
  return { error: error?.message ?? null };
}

// ===================== EMPLOYEE: CERTIFICATES =====================
export async function fetchCertificatesForUser(userId: string): Promise<(Certificate & { user_course_requirement?: UserCourseRequirement & { course?: Course } })[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, user_course_requirement:user_course_requirements!inner(*, course:courses(*))')
    .eq('user_course_requirement.user_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as (Certificate & { user_course_requirement?: UserCourseRequirement & { course?: Course } })[];
}

// ===================== EMPLOYEE: ROLE CERTIFICATIONS =====================
export async function fetchRoleCertificationsForUser(userId: string): Promise<(RoleCertification & { job_role?: JobRole })[]> {
  const { data, error } = await supabase
    .from('role_certifications')
    .select('*, job_role:job_roles(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as (RoleCertification & { job_role?: JobRole })[];
}

// ===================== EMPLOYEE: USER COURSE REQUIREMENTS FOR USER =====================
export async function fetchUserCourseRequirementsForUser(userId: string): Promise<(UserCourseRequirement & { course?: Course; job_role?: JobRole })[]> {
  const { data, error } = await supabase
    .from('user_course_requirements')
    .select('*, course:courses(*), job_role:job_roles(*)')
    .eq('user_id', userId)
    .order('assigned_at', { ascending: false });
  if (error || !data) return [];
  return data as (UserCourseRequirement & { course?: Course; job_role?: JobRole })[];
}
