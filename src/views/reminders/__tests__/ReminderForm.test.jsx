import { render, screen, fireEvent } from '@testing-library/react';
import ReminderForm from '../ReminderForm';

// Mock reminder types data
const mockReminderTypes = [
  { value: 'water', label: 'Water', icon: '💧', sound: 'drop', suggestedTimes: ['09:00', '11:00'] },
  { value: 'meal', label: 'Meal', icon: '🍽️', sound: 'bell', suggestedTimes: ['08:00', '13:00'] }
];

describe('ReminderForm Component', () => {
  test('renders form with default values when no initialData', () => {
    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();
    
    render(
      <ReminderForm 
        reminderTypes={mockReminderTypes}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
    
    // Default type should be 'water'
    expect(screen.getByText('Water')).toBeInTheDocument();
    
    // Time should default to 09:00
    expect(screen.getByText('09:00')).toBeInTheDocument();
    
    // Weekdays should be selected by default
    const mondayButton = screen.getByRole('button', { name: /M/i });
    expect(mondayButton).toHaveClass('bg-emerald-500');
  });

  test('submits the form with entered data', () => {
    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();
    
    render(
      <ReminderForm 
        reminderTypes={mockReminderTypes}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
    
    // Change the reminder type
    const mealTypeButton = screen.getByText('Meal');
    fireEvent.click(mealTypeButton);
    
    // Change the message
    const messageInput = screen.getByPlaceholderText('Reminder message...');
    fireEvent.change(messageInput, { target: { value: 'New test message' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Add Reminder/i });
    fireEvent.click(submitButton);
    
    // Check that onSubmit was called with updated values
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'meal',
        message: 'New test message'
      })
    );
  });
});
