import type { DocSection } from '@/lib/docs';

export const employeeDocSectionsEN: DocSection[] = [
  {
    id: 'inicio',
    title: 'Home',
    icon: 'LayoutDashboard',
    summary: 'Your welcome screen: a summary of your courses, your progress and what is still pending.',
    sections: [
      {
        heading: 'What does the Home screen show?',
        body: 'It is the first screen you see when you sign in. It greets you by name and shows cards with your assigned courses, your overall progress, the number of certificates you have earned, and quick links to the catalog and the calendar.',
      },
      {
        heading: 'Summary cards',
        body: '"Assigned courses" is the number of courses your role requires. "Total progress" shows how many of those courses you have passed. "Certificates" counts the courses that already have their certificate.',
        example: 'If your role has 4 assigned courses and you have passed the final test of 2 of them, you will see 4 under "Assigned courses" and a progress of 2 out of 4.',
      },
      {
        heading: 'Continue learning',
        body: 'Shows up to 3 courses you have started but not finished. Click "View all" to go to the full catalog.',
        example: 'You started "Basic Industrial Safety" and completed its first 2 modules. It will stay in this list until you pass its final test.',
      },
      {
        heading: 'Upcoming dates',
        body: 'Lists the courses that have a deadline to be completed. Use it to decide which course to finish first.',
      },
      {
        heading: 'Recommended steps to get started',
        body: 'Follow these steps: 1) Open the Catalog and choose an assigned course. 2) Click "Start course" and review the modules. 3) Complete each module in order. 4) Pass the module exams when they exist. 5) Take the course final test with at least 90%. 6) Check your certificate in the Certificates section.',
        example: 'On Monday you open "Preventive Maintenance" and complete 3 modules. On Tuesday, from "Continue learning", you return to that course to pick up the fourth module.',
      },
    ],
  },
  {
    id: 'catalogo',
    title: 'Course catalog',
    icon: 'BookOpen',
    summary: 'Find the courses assigned to your role, check their status and open them to study.',
    sections: [
      {
        heading: 'What do I find here?',
        body: 'All the courses your administrator assigned to your role. Each card shows the title, the duration, its status and the percentage completed with a progress bar.',
      },
      {
        heading: 'Course statuses',
        body: 'Not started: you have not opened the course yet. In progress: you have completed at least one module but have not passed the course final test. Completed: you passed the course final test.',
      },
      {
        heading: 'Search and filter',
        body: 'Type in the search box to find a course by its title. Use the filters All, In progress, Not started or Completed to narrow the list. If there are many courses, the list is split into pages.',
        example: 'You want to resume a half-finished course: click "In progress" and you will only see the courses you left pending.',
      },
      {
        heading: 'Opening a course',
        body: 'Click the cover or the arrow on the card to open the course details. From there you can see the list of modules, take the direct test or the final test, and start or continue the course.',
      },
    ],
  },
  {
    id: 'curso',
    title: 'Studying a course',
    icon: 'PlayCircle',
    summary: 'How to move through a course modules: readings, videos, PDFs and presentations.',
    sections: [
      {
        heading: 'Course details',
        body: 'When you open a course you will see its list of modules with their type: Video, Infographic or Reading. The main button says "Start course" the first time, or "Continue course" if you have already made progress.',
      },
      {
        heading: 'Player and module bar',
        body: 'Inside the course, the "Modules" side bar shows how many modules you have completed (for example, "2 / 5 modules completed"). Move between modules with the "Previous" and "Next" buttons.',
      },
      {
        heading: 'Modules unlock in order',
        body: 'Modules unlock one by one. You can only go as far as the first module you have not completed. The following ones stay locked until you finish the previous one.',
        example: 'A course has 4 modules. You completed modules 1 and 2. You can open module 3, but module 4 stays locked until you complete module 3.',
      },
      {
        heading: 'How each type of module is completed',
        body: 'Reading and Infographic: the module is marked as completed when you click "Next". Video, PDF and PowerPoint presentation: the "Next" button is enabled only when you reach the end of the video or the last page or slide.',
        example: 'In a 6-page PDF, keep using "Next" until page 6. Reaching it enables moving on to the next module.',
      },
      {
        heading: 'Module exam',
        body: 'If a module has questions, the "Module exam" button appears. You must pass it to move on to the next module. The message "You must pass the module exam to continue" appears if you try to go on without passing it.',
      },
      {
        heading: 'Leaving the course',
        body: 'Use "Leave course" to return to the catalog. Your progress is kept: the modules you completed stay marked the next time you come back.',
      },
    ],
  },
  {
    id: 'examenes',
    title: 'Exams and tests',
    icon: 'ClipboardCheck',
    summary: 'Types of assessment, the 90% rule, and how to answer and retry.',
    sections: [
      {
        heading: 'Types of assessment',
        body: 'Direct test: you can take it without studying the course, to show you already know the content. Module exam: it is inside a module and you must pass it to move on. Final test: the final assessment of the course; it becomes available once you complete all the modules.',
      },
      {
        heading: 'Passing rule: 90%',
        body: 'To pass you need at least 90% correct answers. If you do not reach it, the result tells you that you can try again.',
        example: 'The exam has 10 questions. If you answer 9 correctly, you get 90% and pass. With 8 correct (80%) you do not pass and can retry.',
      },
      {
        heading: 'How to answer each question',
        body: 'Select an option (A, B, C...). When you click "Next", the system shows whether your answer is correct or incorrect and locks it. Click "Next" again to go to the next question. On the last question the button says "Finish and see result" and requires every question to be answered.',
      },
      {
        heading: 'Questions panel',
        body: 'On the side you will see the list of questions with a status indicator for each one, and the reminder "Minimum to pass: 90%". This tells you how many questions are still left to answer.',
      },
      {
        heading: 'Result and breakdown',
        body: 'At the end you will see whether you passed. Below it, the "Question breakdown" shows each question marked as Correct or Incorrect, your answer and the correct answer when you got it wrong. Unanswered questions appear as "Not answered".',
      },
      {
        heading: 'Retrying',
        body: 'If you do not pass, click "Retry". The answers are reset and you can take it as many times as you need.',
      },
      {
        heading: 'Failed direct test',
        body: 'If you fail the direct test, that option is locked and the system tells you "You have failed the direct test". In that case click "Go to course" and complete the modules.',
      },
    ],
  },
  {
    id: 'calendario',
    title: 'Calendar',
    icon: 'CalendarDays',
    summary: 'Monthly view of your courses and deadlines to plan your training.',
    sections: [
      {
        heading: 'What is it for?',
        body: 'It shows your scheduled courses and assessments in a monthly calendar. Use it to see at a glance what is pending and when it is due.',
      },
      {
        heading: 'Browsing months',
        body: 'Use the arrows next to the month name to see the previous or next month. Courses with a deadline appear marked in the calendar.',
      },
      {
        heading: 'Upcoming courses',
        body: 'The side panel lists up to 5 courses, sorted by deadline. Click one to open its details and keep studying.',
        example: 'You see "Emergencies" first in the list because it is due before "Preventive Maintenance". You click it, review the details and press "Continue course".',
      },
    ],
  },
  {
    id: 'certificados',
    title: 'Certificates',
    icon: 'Award',
    summary: 'Certificates for the courses you have passed, ready to review.',
    sections: [
      {
        heading: 'When do I get a certificate?',
        body: 'Each time you pass the final test of a course, its certificate appears in the "My certificates" section. Certificates are only issued for passed courses.',
        example: 'You passed "Basic Industrial Safety" with 92%. Its card now appears with the title "Certificate of completion".',
      },
      {
        heading: 'Viewing a certificate',
        body: 'Click "View certificate" on the card to open the preview, which shows your name as the recipient and the course you completed.',
      },
      {
        heading: 'Certifications summary',
        body: 'At the top you can see how many certifications you have earned. If you do not have any yet, the list will tell you.',
      },
    ],
  },
  {
    id: 'notificaciones',
    title: 'Notifications',
    icon: 'Bell',
    summary: 'Messages from the system and your administrator: reminders, achievements and news.',
    sections: [
      {
        heading: 'What do I receive here?',
        body: 'Messages from your administrator (reminders, notices about courses due soon, congratulations) and automatic system notices, for example when you complete a course or earn a certificate.',
        example: 'You receive "Pending course: you have 15 days to complete the Emergencies course".',
      },
      {
        heading: 'Reading and marking',
        body: 'Unread notifications appear with the counter "X unread". Click one to mark it as read. To clear everything at once, click "Mark all as read".',
      },
    ],
  },
  {
    id: 'perfil',
    title: 'My profile',
    icon: 'User',
    summary: 'Your personal details, your photo, your role history and your password.',
    sections: [
      {
        heading: 'Personal information',
        body: 'Click "Edit profile" to change your full name, email, ID number, phone or address. Then click "Save profile". You will see the message "Profile updated successfully".',
      },
      {
        heading: 'Profile photo',
        body: 'You can upload an image from your device or take one with the camera. You can also remove it if you do not want to use it.',
      },
      {
        heading: 'Read-only details',
        body: 'Your role, your hire date and the date since you have held your current role are managed by the company. If something is wrong, ask your administrator.',
      },
      {
        heading: 'Changing your password',
        body: 'Enter the new password, confirm it and click "Update password". It must have at least 6 characters and both fields must match.',
        example: 'You type "Work2026" in both fields and click "Update password". If the fields do not match, you will see "Passwords do not match".',
      },
      {
        heading: 'Role history',
        body: 'Shows the roles you have had: start date, end date, the reason for the change and which one is your current role.',
      },
    ],
  },
  {
    id: 'feedback',
    title: 'Feedback',
    icon: 'Star',
    summary: 'Your opinion on the courses you completed, to help us improve the training.',
    sections: [
      {
        heading: 'When does it appear?',
        body: 'After passing the final test of a course, the "Rate course" form opens. Your feedback helps your administrator improve the courses.',
      },
      {
        heading: 'What you can answer',
        body: 'A rating from 1 to 5 stars (required). Whether you would recommend the course: Yes or No. The difficulty level: Very easy, Easy, Medium, Hard or Very hard. And an optional comment.',
        example: 'You rate "Preventive Maintenance" with 4 stars, mark "Yes" for recommending it, choose difficulty "Medium" and write "Very useful for day-to-day work". Then press "Submit rating".',
      },
    ],
  },
];
