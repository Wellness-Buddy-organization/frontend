import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReminderListView from '../ReminderListView';
import { reminderController } from '../../../controllers';

// Mock the controller
jest.mock('../../../controllers', () => ({
  reminderController: {
    fetchReminders: jest.fn(),
    addReminder: jest.fn(),
    updateReminder: jest.fn(),
    deleteReminder: jest.fn(),
    applyTemplatePack: jest.fn()
  }
}));

const mockReminders = [
  {
    _id: 'reminder1',
    type: 'water',
    time: '09:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    enabled: true,
    message: 'Drink water',
    sound: 'drop',
    getFormattedDays: () => 'Weekdays'
  }
];

describe('ReminderListView Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful reminder fetching
    reminderController.fetchReminders.mockImplementation((onSuccess) => {
      onSuccess(mockReminders);
      return Promise.resolve(mockReminders);
    });
  });

  test('renders reminders list and allows creating new reminder', async () => {
    // Mock successful reminder creation
    reminderController.addReminder.mockImplementation((data, onSuccess) => {
      const newReminder = { 
        _id: 'new-reminder', 
        ...data,
        getFormattedDays: () => 'Weekdays'
      };
      onSuccess(newReminder);
      return Promise.resolve(newReminder);
    });
    
    render(
      <MemoryRouter>
        <ReminderListView />
      </MemoryRouter>
    );
    
    // Wait for reminders to load
    await waitFor(() => {
      expect(reminderController.fetchReminders).toHaveBeenCalled();
    });
    
    // Verify existing reminder is displayed
    expect(screen.getByText('Drink water')).toBeInTheDocument();
    
    // Click the "New Reminder" button
    const newReminderButton = screen.getByText(/New Reminder/i);
    fireEvent.click(newReminderButton);
    
    // Form should appear
    expect(screen.getByText('New Reminder')).toBeInTheDocument();
    
    // Submit the form with default values
    const addButton = screen.getByRole('button', { name: /Add Reminder/i });
    fireEvent.click(addButton);
    
    // Verify the controller was called
    await waitFor(() => {
      expect(reminderController.addReminder).toHaveBeenCalled();
    });
    
    // Success notification should appear
    expect(screen.getByText(/Reminder added successfully/i)).toBeInTheDocument();
  });
});
