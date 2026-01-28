import { describe, it, expect, beforeEach, vi } from 'vitest';
import loadingSlice, { loadingActions } from '../store/actions/loadingSlice.js';

// UNIT TESTS 11-16: testowanie funkcjonalności loadingSlice - stan ładowania
// MOCK 3: izolowanie testu za pomocą beforeEach

let testState;
let mockToggleAction;
let testExecutionLog;

describe('loadingSlice Reducer', () => {
  beforeEach(() => {
    // nowe mocki przed każdym testem
    testState = undefined;
    mockToggleAction = vi.fn(loadingActions.toggleLoading);
    testExecutionLog = [];
  });
  
  // UNIT TEST 11: początkowy stan ładowania
  it('should have initial state as true', () => {
    testState = loadingSlice.reducer(testState, { type: 'unknown' });
    expect(testState).toBe(true);
  });

  // UNIT TEST 12: sprawdzanie poprawnego typu akcji Redux podczas przełączania
  it('should use correct Redux action type when toggling', () => {
    const action = loadingActions.toggleLoading(false);
    expect(action.type).toBe('loadingRedux/toggleLoading');
    expect(action.payload).toBe(false);
    
    const actual = loadingSlice.reducer(true, action);
    expect(actual).toBe(false);
  });

  // UNIT TEST 13: przełączanie ładowania na true
  it('should toggle loading to true', () => {
    testState = false;
    const action = mockToggleAction(true);
    const actual = loadingSlice.reducer(testState, action);
    expect(actual).toBe(true);
    // mock powinien być zresetowany przez beforeEach (count = 1, nie skumulowany z testu 12)
    expect(mockToggleAction).toHaveBeenCalledTimes(1);
    expect(mockToggleAction).toHaveBeenCalledWith(true);
  });

  // UNIT TEST 14: sprawdzanie funkcji action creator toggleLoading
  it('should have toggleLoading action creator function', () => {
    expect(typeof loadingActions.toggleLoading).toBe('function');
    const action = loadingActions.toggleLoading(false);
    expect(action).toHaveProperty('type');
    expect(action).toHaveProperty('payload');
    expect(action.payload).toBe(false);
  });

  // UNIT TEST 15: sprawdzanie że oryginalny stan nie jest mutowany
  it('should not mutate original state', () => {
    const originalState = true;
    const actual = loadingSlice.reducer(originalState, loadingActions.toggleLoading(false));
    
    expect(actual).toBe(false);
    expect(originalState).toBe(true); // oryginalny stan niezmieniony
    expect(actual).not.toBe(originalState);
  });

  // UNIT TEST 16: obsługa wielokrotnych przełączeń
  it('should handle multiple toggles correctly', () => {
    testState = true;
    testState = loadingSlice.reducer(testState, loadingActions.toggleLoading(false));
    expect(testState).toBe(false);
    testState = loadingSlice.reducer(testState, loadingActions.toggleLoading(true));
    expect(testState).toBe(true);
    testState = loadingSlice.reducer(testState, loadingActions.toggleLoading(false));
    expect(testState).toBe(false);
  });
});
