import { useState } from 'react';
import { Catalog } from '@/components/employee/CourseCatalog';
import { useEmployeeContext } from '@/components/employee/EmployeeLayout';
import { usePreferences } from '@/lib/preferences';

export function CatalogPage() {
  const { t } = usePreferences();
  const { profile, courses, getCourseState, setSelectedCourse } = useEmployeeContext();
  const [filter, setFilter] = useState(t.all);
  const [query, setQuery] = useState('');
  return <Catalog t={t} filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} courses={courses} getCourseState={getCourseState} onSelect={setSelectedCourse} jobRole={profile.job_role} />;
}
