import { Routes, Route } from 'react-router-dom';
import { ShellLayout } from './shell/ShellLayout';
import { HomePage } from './shell/HomePage';
import { JournalPage } from '../features/journal/JournalPage';
import { RemindersPlaceholder } from '../features/placeholders/RemindersPlaceholder';
import { PlaceholderPage } from '../features/placeholders/PlaceholderPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<ShellLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/reminders" element={<RemindersPlaceholder />} />
        <Route
          path="/categories"
          element={
            <PlaceholderPage title="Categories & Aggregates" message="Coming in a future release." />
          }
        />
        <Route
          path="/about"
          element={<PlaceholderPage title="About" message="Reminder — car maintenance journal." />}
        />
        <Route path="/faq" element={<PlaceholderPage title="FAQ" message="" />} />
        <Route
          path="/trash"
          element={<PlaceholderPage title="Trash" message="Coming in a future release." />}
        />
        <Route
          path="/settings"
          element={<PlaceholderPage title="Settings" message="Coming in a future release." />}
        />
      </Route>
    </Routes>
  );
}
