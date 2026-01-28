import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import bagSlice from '../store/actions/bagSlice.js';
import itemsSlice from '../store/actions/itemsSlice.js';
import loadingSlice from '../store/actions/loadingSlice.js';

// UNIT TESTS 17-20: testowanie integracji sklepu
// MOCK 4: vi.spyOn() - szpiegowanie metod
// MOCK 5: vi.mock() - demonstracja poprzez mockowanie konsoli

// mock console.error żeby śledzić błędy podczas inicjalizacji
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Redux Store Integration', () => {
  // UNIT TEST 17: inicjalizacja sklepu z poprawnymi stanami początkowymi
  it('should initialize store with correct initial states', () => {
    consoleErrorSpy.mockClear(); // czyszczenie mocka przed testem
    
    const store = configureStore({
      reducer: {
        bagRedux: bagSlice.reducer,
        itemsRedux: itemsSlice.reducer,
        loadingRedux: loadingSlice.reducer
      }
    });
    
    const state = store.getState();
    expect(state.bagRedux).toEqual([]);
    expect(state.itemsRedux).toEqual([]);
    expect(state.loadingRedux).toBe(true);
    
    // sprawdzam czy nie było błędów podczas inicjalizacji
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  // UNIT TEST 18: integracja Bag i Items
  it('should handle bag items correctly with items data', () => {
    const store = configureStore({
      reducer: {
        bagRedux: bagSlice.reducer,
        itemsRedux: itemsSlice.reducer
      }
    });
    
    // dodaję przedmioty do sklepu
    const items = [
      { id: 'item-1', item_name: 'Shirt' },
      { id: 'item-2', item_name: 'Pants' }
    ];
    store.dispatch({ type: 'itemsRedux/addInitialItem', payload: items });
    
    // dodaję przedmioty do torby
    store.dispatch({ type: 'bagRedux/addToBag', payload: 'item-1' });
    store.dispatch({ type: 'bagRedux/addToBag', payload: 'item-2' });
    
    const state = store.getState();
    expect(state.bagRedux).toEqual(['item-1', 'item-2']);
    expect(state.itemsRedux).toHaveLength(2);
  });

  // UNIT TEST 19: workflow ładowania
  it('should handle loading workflow correctly', () => {
    const store = configureStore({
      reducer: {
        loadingRedux: loadingSlice.reducer,
        itemsRedux: itemsSlice.reducer
      }
    });
    
    // początkowy stan - ładowanie
    expect(store.getState().loadingRedux).toBe(true);
    
    // symulacja zakończenia wywołania API
    store.dispatch({ type: 'itemsRedux/addInitialItem', payload: [{id: '1'}] });
    store.dispatch({ type: 'loadingRedux/toggleLoading', payload: false });
    
    expect(store.getState().loadingRedux).toBe(false);
    expect(store.getState().itemsRedux).toHaveLength(1);
  });

  // UNIT TEST 20: kompletny przepływ zakupowy
  it('should handle complete shopping flow', () => {
    const store = configureStore({
      reducer: {
        bagRedux: bagSlice.reducer,
        itemsRedux: itemsSlice.reducer,
        loadingRedux: loadingSlice.reducer
      }
    });
    
    // szpiegowanie dispatch
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    // 1. start ładowania
    expect(store.getState().loadingRedux).toBe(true);
    
    // 2. załaduj przedmioty
    const items = [{ id: 'item-1' }, { id: 'item-2' }];
    store.dispatch({ type: 'itemsRedux/addInitialItem', payload: items });
    
    // 3. zatrzymaj ładowanie
    store.dispatch({ type: 'loadingRedux/toggleLoading', payload: false });
    
    // 4. dodaj przedmiot do torby
    store.dispatch({ type: 'bagRedux/addToBag', payload: 'item-1' });
    
    // 5. usuń przedmiot z torby
    store.dispatch({ type: 'bagRedux/removeFromBag', payload: 'item-1' });
    
    // sprawdzam czy dispatch został wywołany 4 razy (kroki 2-5)
    expect(dispatchSpy).toHaveBeenCalledTimes(4);
    
    const finalState = store.getState();
    expect(finalState.loadingRedux).toBe(false);
    expect(finalState.itemsRedux).toHaveLength(2);
    expect(finalState.bagRedux).toEqual([]);
    
    dispatchSpy.mockRestore();
  });
});
