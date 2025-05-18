import WellnessData from '../WellnessData';

describe('WellnessData Model', () => {
  let sampleData;

  beforeEach(() => {
    sampleData = {
      mood: [
        { mood: 'happy', date: '2023-01-01T00:00:00.000Z' },
        { mood: 'neutral', date: '2023-01-02T00:00:00.000Z' }
      ],
      sleep: [
        { hours: 7, quality: 'good', date: '2023-01-01T00:00:00.000Z' },
        { hours: 8, quality: 'excellent', date: '2023-01-02T00:00:00.000Z' }
      ],
      hydration: [
        { glasses: 6, date: '2023-01-01T00:00:00.000Z' },
        { glasses: 8, date: '2023-01-02T00:00:00.000Z' }
      ],
      work: [
        { hours: 8, date: '2023-01-01T00:00:00.000Z' },
        { hours: 7, date: '2023-01-02T00:00:00.000Z' }
      ],
      breaks: [
        { duration: 10, type: 'short', date: '2023-01-01T00:00:00.000Z' },
        { duration: 15, type: 'lunch', date: '2023-01-02T00:00:00.000Z' }
      ]
    };
  });

  test('Creates a WellnessData instance with default empty arrays', () => {
    const wellnessData = new WellnessData();
    expect(wellnessData.mood).toEqual([]);
    expect(wellnessData.sleep).toEqual([]);
    expect(wellnessData.hydration).toEqual([]);
    expect(wellnessData.work).toEqual([]);
    expect(wellnessData.breaks).toEqual([]);
  });

  test('Creates a WellnessData instance with provided data', () => {
    const wellnessData = new WellnessData(sampleData);
    expect(wellnessData.mood).toEqual(sampleData.mood);
    expect(wellnessData.sleep).toEqual(sampleData.sleep);
    expect(wellnessData.hydration).toEqual(sampleData.hydration);
    expect(wellnessData.work).toEqual(sampleData.work);
    expect(wellnessData.breaks).toEqual(sampleData.breaks);
  });

  test('getAverageMood returns the correct average mood score', () => {
    const wellnessData = new WellnessData(sampleData);
    // happy = 5, neutral = 4, average = 4.5
    expect(wellnessData.getAverageMood()).toBe(4.5);
  });

  test('getAverageSleep returns the correct average sleep hours', () => {
    const wellnessData = new WellnessData(sampleData);
    // (7 + 8) / 2 = 7.5
    expect(wellnessData.getAverageSleep()).toBe(7.5);
  });

  test('calculateWellnessScore returns a score between 0-100', () => {
    const wellnessData = new WellnessData(sampleData);
    const score = wellnessData.calculateWellnessScore();
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('fromApiResponse creates a WellnessData from API data', () => {
    const apiData = {
      mood: [{ mood: 'happy', date: '2023-01-01T00:00:00.000Z' }],
      sleep: [{ hours: 7, quality: 'good', date: '2023-01-01T00:00:00.000Z' }],
      hydration: [{ glasses: 8, date: '2023-01-01T00:00:00.000Z' }]
    };
    
    const wellnessData = WellnessData.fromApiResponse(apiData);
    expect(wellnessData.mood).toEqual(apiData.mood);
    expect(wellnessData.sleep).toEqual(apiData.sleep);
    expect(wellnessData.hydration).toEqual(apiData.hydration);
  });
});
