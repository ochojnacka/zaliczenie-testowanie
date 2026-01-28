import { describe, it, expect, beforeEach } from 'vitest';
import itemsSlice, { itemsActions } from '../store/actions/itemsSlice.js';

// UNIT TESTS 7-10: testowanie funkcjonalności itemsSlice - przedmioty
// MOCK 2: Mock obiektów API

let mockApiItems;
let mockEmptyResponse;

describe('itemsSlice Reducer', () => {
  beforeEach(() => {
    // nowe mocki przed każdym testem
    mockApiItems = [
      { id: '1', item_name: 'Shirt', current_price: 800, original_price: 1000 },
      { id: '2', item_name: 'Pants', current_price: 1200, original_price: 1500 }
    ];
    mockEmptyResponse = [];
  });

  // UNIT TEST 7: początkowy pusty stan
  it('should return initial empty array', () => {
    expect(itemsSlice.reducer(undefined, { type: 'unknown' })).toEqual([]);
  });

  // UNIT TEST 8: dodanie przedmiotów z API
  it('should add initial items from API', () => {
    const actual = itemsSlice.reducer([], itemsActions.addInitialItem(mockApiItems));
    expect(actual).toEqual(mockApiItems);
    expect(actual).toHaveLength(2);
    expect(actual[0]).toHaveProperty('item_name');
  });

  // UNIT TEST 9: sprawdzanie czy wszystkie właściwości przedmiotu są zachowane z API
  it('should preserve all item properties from API', () => {
    const actual = itemsSlice.reducer([], itemsActions.addInitialItem(mockApiItems));
    
    // sprawdzam czy pierwszy przedmiot ma wszystkie oczekiwane właściwości
    expect(actual[0]).toHaveProperty('id');
    expect(actual[0]).toHaveProperty('item_name');
    expect(actual[0]).toHaveProperty('current_price');
    expect(actual[0]).toHaveProperty('original_price');
    expect(actual[0].current_price).toBeLessThan(actual[0].original_price);
  });

  // UNIT TEST 10: obsługa pustej tablicy przedmiotów
  it('should handle empty items array', () => {
    const actual = itemsSlice.reducer([], itemsActions.addInitialItem(mockEmptyResponse));
    expect(actual).toEqual([]);
    expect(actual).toHaveLength(0);
  });
});
