# Dokumentacja

## Przegląd

Pakiet testów dla aplikacji e-commerce React: 30 testów (20 unit + 10 E2E).

**Projekt oryginalny:** [100-React-Projects - Advance React E-commerce with Real-Backend](https://github.com/vishal-dcode/100-React-Projects/tree/d2869eb418e03f6fc9007e93f832fa5fedcefa63/Advance%20React%20E-commerce%20with%20Real-Backend)

## Zmiany w Projekcie

W porównaniu do oryginalnego projektu dodano:

- ✅ 30 testów (20 unit + 10 E2E)
- ✅ Vitest - do testów jednostkowych
- ✅ Playwright - framework do testów E2E
- ✅ Pliki konfiguracyjne (vitest.config.js, playwright.config.js, setup.js)
- ✅ Folder src/test/ - 4 pliki testowe
- ✅ Folder e2e/ - testy end-to-end

Oryginalny kod aplikacji pozostał niezmieniony.

## Uruchomienie Projektu

### Instalacja

```bash
# 1. Instalacja zależności serwera
cd server
npm install

# 2. Instalacja zależności klienta
cd ../client
npm install
```

### Uruchomienie

**Terminal 1 - Backend:**

```bash
cd server
npm start
# Serwer uruchomi się na http://localhost:8080
```

**Terminal 2 - Frontend i testy:**

````bash
cd client

# Uruchomienie aplikacji w trybie deweloperskim
npm run dev

# LUB uruchomienie testów

## Uruchamianie Testów

```bash
# Wszystkie testy jednostkowe
npm test

# Testy E2E
npm run test:e2e

# Wszystkie testy (unit + E2E)
npm run test:all

# Tryb watch
npm test -- --watch

# Pokrycie kodu
npm run test:coverage

# UI dla testów
npm run test:ui
npm run test:e2e:ui
````

## Struktura Testów

### Testy Jednostkowe (20 testów)

**bagSlice.test.js** (6 testów)

- Testowanie koszyka zakupów (dodawanie/usuwanie przedmiotów)

**itemsSlice.test.js** (4 testy)

- Testowanie katalogu produktów (ładowanie z API)

**loadingSlice.test.js** (6 testów)

- Testowanie stanu ładowania (spinner)

**storeIntegration.test.js** (4 testy)

- Testowanie integracji Redux (współpraca slices)

### Testy E2E (10 testów)

**e2e/ecommerce.spec.js** (10 testów)

- Testowanie kompletnych przepływów użytkownika w przeglądarce

## Strategie Mockowania

1. **vi.fn()** - Mockowanie funkcji akcji
2. **Mock Data Objects** - Symulowanie danych z API
3. **beforeEach** - Izolacja testów
4. **vi.spyOn()** - Szpiegowanie wywołań metod
5. **mockImplementation** - Zastępowanie implementacji

## Wyniki

✅ 30/30 testów przechodzi
✅ 100% pokrycie kodu

## Technologie

- **Vitest 4.0.18** - Framework do testów jednostkowych
- **Playwright** - Framework do testów E2E
- **Redux Toolkit** - Zarządzanie stanem

## Pliki Testowe

```
src/test/
├── bagSlice.test.js           # 6 testów
├── itemsSlice.test.js         # 4 testy
├── loadingSlice.test.js       # 6 testów
├── storeIntegration.test.js   # 4 testy
└── setup.js                   # Konfiguracja

e2e/
└── ecommerce.spec.js          # 10 testów
```
