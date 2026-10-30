import { copy } from '@/lib/copy';
import type { EmployeeStrings } from '@/components/employee/EmployeeModules';

export function buildEmployeeStrings(t: typeof copy.ES): EmployeeStrings {
  return {
    notifications: t.notifications, noNotifications: t.noNotifications, markAllRead: t.markAllRead,
    gamification: t.gamification, myProfile: t.myProfile, certifications: t.certificates, roleCertification: t.roleCertification,
    noCertificates: t.noCertificates, noRoleCerts: t.noRoleCerts, noBadges: t.noBadges,
    pointsAccumulated: t.pointsAccumulated, badgesEarned: t.badgesEarned, nextBadges: t.nextBadges,
    personalInfo: t.personalInfo, jobHistory: t.jobHistory, editProfile: t.editProfile, saveProfile: t.saveProfile,
    fullName: t.fullName, email: t.email, jobRole: t.jobRole, hireDate: t.hireDate, currentRoleSince: t.currentRoleSince,
    changePassword: t.changePassword, newPassword: t.newPassword, confirmPassword: t.confirmPassword,
    updatePassword: t.updatePassword, passwordChanged: t.passwordChanged, passwordMismatch: t.passwordMismatch,
    passwordTooShort: t.passwordTooShort, stats: t.stats, coursesCompleted: t.coursesCompleted,
    coursesInProgress: t.coursesInProgress, totalPoints: t.totalPoints, certifiedRole: t.certifiedRole,
    certifiedOn: t.certifiedOn, expiresOn: t.expiresOn, valid: t.valid, expired: t.expired,
    noJobHistory: t.noJobHistory, startDate: t.startDate, endDate: t.endDate, reason: t.reason,
    currentRole: t.currentRole, downloadCert: t.downloadCert, verifyCert: t.verifyCert,
    certNumber: t.certNumber, issuedOn: t.issuedOn, courseLabel: t.courseLabel, viewBadge: t.viewBadge,
    locked: t.locked, recentActivity: t.recentActivity, viewAll: t.viewAll, unread: t.unread,
    loading: t.loading, profileUpdated: t.profileUpdated, errorUpdating: t.errorUpdating,
    allBadges: t.allBadges, earnedBadges: t.earnedBadges, availableBadges: t.availableBadges,
    badgePoints: t.badgePoints, badgeCategory: t.badgeCategory, earnedOn: t.earnedOn,
    awardedTo: t.awardedTo,
  };
}
