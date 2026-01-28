import { describe, it, expect, vi, beforeEach } from 'vitest';
import bagSlice, { bagActions } from '../store/actions/bagSlice.js';

// UNIT TESTS 1-6: testowanie funkcjonalności bagSlice - koszyk
// MOCK 1: vi.fn() funkcje do śledzenia wywołań

let mockAddToBag;
let mockRemoveFromBag;

describe('bagSlice Reducer', () => {
  beforeEach(() => {
    // nowe mocki przed każdym testem
    mockAddToBag = vi.fn(bagActions.addToBag);
    mockRemoveFromBag = vi.fn(bagActions.removeFromBag);
  });

  // UNIT TEST 1: sprawdzanie pustej tablicy dla różnych nieznanych akcji
  it('should return empty array for any unknown action', () => {
    expect(bagSlice.reducer(undefined, { type: 'unknown' })).toEqual([]);
    expect(bagSlice.reducer([], { type: 'random' })).toEqual([]);
    expect(bagSlice.reducer([], { type: '@@INIT' })).toEqual([]);
  });

  // UNIT TEST 2: dodanie przedmiotu do koszyka
  it('should add item to bag', () => {
    const initialState = [];
    const action = mockAddToBag('item-1');
    const actual = bagSlice.reducer(initialState, action);
    expect(actual).toEqual(['item-1']);

    // sprawdzam czy mock został wywołany z poprawnym argumentem
    expect(mockAddToBag).toHaveBeenCalledWith('item-1');
    expect(mockAddToBag).toHaveBeenCalledTimes(1);
  });

  // UNIT TEST 3: dodanie wielu przedmiotów do koszyka
  it('should add multiple items to bag', () => {
    let state = [];
    state = bagSlice.reducer(state, bagActions.addToBag('item-1'));
    state = bagSlice.reducer(state, bagActions.addToBag('item-2'));
    expect(state).toEqual(['item-1', 'item-2']);
  });

  // UNIT TEST 4: usuwanie przedmiotu z koszyka
  it('should remove item from bag', () => {
    const initialState = ['item-1', 'item-2', 'item-3'];
    const action = mockRemoveFromBag('item-2');
    const actual = bagSlice.reducer(initialState, action);
    expect(actual).toEqual(['item-1', 'item-3']);
    
    expect(mockRemoveFromBag).toHaveBeenCalledWith('item-2');
    expect(mockRemoveFromBag).toHaveBeenCalledTimes(1);
  });

  // UNIT TEST 5: usuwanie nieistniejącego przedmiotu
  it('should not change state when removing non-existent item', () => {
    const initialState = ['item-1', 'item-2'];
    const actual = bagSlice.reducer(initialState, bagActions.removeFromBag('item-999'));
    expect(actual).toEqual(['item-1', 'item-2']);
  });

  // UNIT TEST 6: weryfikacja typu tablicy nawet gdy jest pusta
  it('should return array type even when empty', () => {
    let state = ['item-1'];
    state = bagSlice.reducer(state, bagActions.removeFromBag('item-1'));
    
    expect(state).toEqual([]);
    expect(Array.isArray(state)).toBe(true);
    expect(state.length).toBe(0);
  });
});
