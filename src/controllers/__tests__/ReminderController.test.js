import { reminderService } from '../../services';
import reminderController from '../ReminderController';

// Mock the service
jest.mock('../../services', () => ({
  reminderService: {
    fetchReminders: jest.fn(),
    addReminder: jest.fn(),
    updateReminder: jest.fn(),
    deleteReminder: jest.fn(),
    applyTemplatePack: jest.fn()
  }
}));

describe('ReminderController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchReminders calls reminderService and success callback', async () => {
    const mockReminders = [{ _id: '123', type: 'water' }];
    reminderService.fetchReminders.mockResolvedValue(mockReminders);
    
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onFinally = jest.fn();
    
    await reminderController.fetchReminders(onSuccess, onError, onFinally);
    
    expect(reminderService.fetchReminders).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(mockReminders);
    expect(onError).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalled();
  });

  test('fetchReminders handles errors and calls error callback', async () => {
    const errorMessage = 'API error';
    reminderService.fetchReminders.mockRejectedValue(new Error(errorMessage));
    
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onFinally = jest.fn();
    
    await expect(reminderController.fetchReminders(onSuccess, onError, onFinally))
      .rejects.toThrow(errorMessage);
    
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalled();
  });

  test('addReminder calls reminderService and success callback', async () => {
    const reminderData = { type: 'water', time: '09:00' };
    const createdReminder = { _id: '123', ...reminderData };
    
    reminderService.addReminder.mockResolvedValue(createdReminder);
    
    const onSuccess = jest.fn();
    const onError = jest.fn();
    
    await reminderController.addReminder(reminderData, onSuccess, onError);
    
    expect(reminderService.addReminder).toHaveBeenCalledWith(reminderData);
    expect(onSuccess).toHaveBeenCalledWith(createdReminder);
    expect(onError).not.toHaveBeenCalled();
  });
});
