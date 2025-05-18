import Reminder from '../Reminder';

describe('Reminder Model', () => {
  test('Creates a reminder with default values', () => {
    const reminder = new Reminder();
    expect(reminder._id).toBe('');
    expect(reminder.type).toBe('water');
    expect(reminder.time).toBe('09:00');
    expect(reminder.days).toEqual(['mon', 'tue', 'wed', 'thu', 'fri']);
    expect(reminder.enabled).toBe(true);
    expect(reminder.message).toBe('');
    expect(reminder.sound).toBe('chime');
  });

  test('Creates a reminder with provided values', () => {
    const data = {
      _id: 'test-id',
      type: 'meal',
      time: '12:00',
      days: ['mon', 'wed', 'fri'],
      enabled: false,
      message: 'Test message',
      sound: 'bell'
    };
    
    const reminder = new Reminder(data);
    expect(reminder._id).toBe('test-id');
    expect(reminder.type).toBe('meal');
    expect(reminder.time).toBe('12:00');
    expect(reminder.days).toEqual(['mon', 'wed', 'fri']);
    expect(reminder.enabled).toBe(false);
    expect(reminder.message).toBe('Test message');
    expect(reminder.sound).toBe('bell');
  });

  test('getFormattedDays returns "Every day" for all days', () => {
    const reminder = new Reminder({
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    });
    expect(reminder.getFormattedDays()).toBe('Every day');
  });

  test('getFormattedDays returns "Weekdays" for weekdays only', () => {
    const reminder = new Reminder({
      days: ['mon', 'tue', 'wed', 'thu', 'fri']
    });
    expect(reminder.getFormattedDays()).toBe('Weekdays');
  });

  test('fromApiResponse creates a Reminder from API data', () => {
    const apiData = {
      _id: 'api-test-id',
      type: 'stretch',
      time: '15:00',
      days: ['tue', 'thu'],
      enabled: true,
      message: 'Time to stretch',
      sound: 'soft'
    };
    
    const reminder = Reminder.fromApiResponse(apiData);
    expect(reminder._id).toBe('api-test-id');
    expect(reminder.type).toBe('stretch');
    expect(reminder.time).toBe('15:00');
    expect(reminder.days).toEqual(['tue', 'thu']);
    expect(reminder.enabled).toBe(true);
    expect(reminder.message).toBe('Time to stretch');
    expect(reminder.sound).toBe('soft');
  });
});
