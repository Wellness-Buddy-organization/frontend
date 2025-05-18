import { wellnessService } from '../../services';
import wellnessController from '../WellnessController';

// Mock the service
jest.mock('../../services', () => ({
  wellnessService: {
    saveMood: jest.fn(),
    saveSleep: jest.fn(),
    saveWork: jest.fn(),
    logBreak: jest.fn(),
    saveWorkLifeBalance: jest.fn(),
    fetchDashboard: jest.fn()
  }
}));

describe('WellnessController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('submitDailyCheckin processes and saves form data', async () => {
    // Mock service responses
    wellnessService.saveMood.mockResolvedValue({ _id: 'mood1', mood: 'happy' });
    wellnessService.saveSleep.mockResolvedValue({ _id: 'sleep1', hours: 7 });
    wellnessService.saveWork.mockResolvedValue({ _id: 'work1', hours: 8 });
    wellnessService.logBreak.mockResolvedValue({ _id: 'break1', duration: 15 });
    
    const formData = {
      mood: 5, // happy
      stress: 2,
      sleepHours: 7,
      sleepQuality: 'good',
      workHours: 8,
      breaksTaken: 2
    };
    
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onFinally = jest.fn();
    
    await wellnessController.submitDailyCheckin(formData, onSuccess, onError, onFinally);
    
    expect(wellnessService.saveMood).toHaveBeenCalled();
    expect(wellnessService.saveSleep).toHaveBeenCalledWith(7, 'good');
    expect(wellnessService.saveWork).toHaveBeenCalledWith(8);
    expect(wellnessService.logBreak).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalled();
  });

  test('logBreak calls wellnessService and success callback', async () => {
    const breakData = { _id: 'break1', duration: 10, type: 'short' };
    wellnessService.logBreak.mockResolvedValue(breakData);
    
    const onSuccess = jest.fn();
    const onError = jest.fn();
    
    await wellnessController.logBreak(onSuccess, onError);
    
    expect(wellnessService.logBreak).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(breakData);
    expect(onError).not.toHaveBeenCalled();
  });
});
