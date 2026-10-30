import { Certificates } from '@/components/employee/CertificatesView';
import { useEmployeeContext } from '@/components/employee/EmployeeLayout';
import { usePreferences } from '@/lib/preferences';

export function CertificatesPage() {
  const { t } = usePreferences();
  const { completedCourses, setPreviewCert } = useEmployeeContext();
  return <Certificates t={t} completedCourses={completedCourses} onPreview={setPreviewCert} />;
}
