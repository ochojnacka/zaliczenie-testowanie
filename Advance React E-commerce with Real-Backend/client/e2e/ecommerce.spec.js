import { test, expect } from '@playwright/test';

// testy E2E

test.describe('E-commerce Application E2E Tests', () => {
  
  // każdy test zaczyna się od przejścia na stronę główną
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // E2E TEST 1: sprawdzenie ładowania strony głównej
  test('E2E-1: Home page loads successfully', async ({ page }) => {
    // sprawdzam czy tytuł strony zawiera "Nextech"
    await expect(page).toHaveTitle(/Nextech/);
    // sprawdzam czy logo jest widoczne
    await expect(page.locator('text=Nextech')).toBeVisible();
  });

  // E2E TEST 2: sprawdzenie widoczności i funkcjonalności headera i navbar-u
  test('E2E-2: Header navigation is visible and functional', async ({ page }) => {
    const header = page.locator('header'); // znajduję element header
    await expect(header).toBeVisible();
    // sprawdzam czy linki nawigacyjne są widoczne
    await expect(header.locator('nav a', { hasText: 'Men' }).first()).toBeVisible();
    await expect(header.locator('text=Women')).toBeVisible();
    await expect(header.locator('text=Kids')).toBeVisible();
  });

  // E2E TEST 3: sprawdzenie paska wyszukiwania
  test('E2E-3: Search bar is present and interactive', async ({ page }) => {
    const searchInput = page.locator('input.search-input'); // znajduję pasek wyszukiwania
    await expect(searchInput).toBeVisible();
    // wpisuję tekst w pasek wyszukiwania
    await searchInput.fill('test search');
    // sprawdzam czy wpisany tekst pozostaje w pasku
    await expect(searchInput).toHaveValue('test search');
  });

  // E2E TEST 4: sprawdzenie ładowania i wyświetlania produktów na stronie głównej
  // testuje asynchroniczne ładowanie danych i renderowanie
  test('E2E-4: Products load and display on home page', async ({ page }) => {
    // czekam na załadowanie się sieci
    await page.waitForLoadState('networkidle');
    
    // czekam aż wskaźnik ładowania zniknie
    await page.waitForSelector('.Loading', { state: 'hidden', timeout: 20000 }).catch(() => {});
    
    // czekam dodatkową sekundę na stabilizację UI
    await page.waitForTimeout(1000);
    
    // czekam aż produkty pojawią się na stronie
    await page.waitForSelector('.item-container', { timeout: 20000 });
    const products = page.locator('.item-container');
    await expect(products.first()).toBeVisible({ timeout: 20000 });
  });

  // E2E TEST 5: dodawanie produktu do koszyka
  test('E2E-5: Add item to bag workflow', async ({ page }) => {
    // czekam aż produkty pojawią się na stronie (ten sam wzorzec co TEST 4)
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.Loading', { state: 'hidden', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1000);
    await page.waitForSelector('.item-container', { timeout: 20000 });
    
    // pobieram licznik produktów w koszyku przed dodaniem produktu
    const bagCount = page.locator('.bag-item-count');
    const initialCount = await bagCount.textContent();
    
    // klikam przycisk "Dodaj do koszyka" dla pierwszego produktu
    const addButton = page.locator('.btn-add-bag').first();
    await addButton.click();
    
    // sprawdzam czy licznik produktów w koszyku się zwiększył (stan Redux zaktualizowany)
    await expect(bagCount).not.toHaveText(initialCount);
  });

  // E2E TEST 6: nawigacja do strony koszyka
  test('E2E-6: Navigate to bag page', async ({ page }) => {
    const bagLink = page.locator('a[href="/bag"]'); // szukam linku do koszyka
    await bagLink.click(); // klikam link
    // sprawdzam czy URL zmienił się na /bag
    await expect(page).toHaveURL(/\/bag/);
  });

  // E2E TEST 7: sprawdzenie warunkowego renderowania gdy koszyk jest pusty
  test('E2E-7: Empty bag displays correct message', async ({ page }) => {
    await page.goto('/bag'); // przechodzę bezpośrednio do koszyka
    await page.waitForLoadState('networkidle');
    
    // czekam aż strona się wyrenderuje
    await page.waitForTimeout(500);
    
    // sprawdzam czy pojawił się komunikat "Bag is empty"
    const emptyMessage = page.locator('text=Bag is empty');
    await expect(emptyMessage).toBeVisible({ timeout: 10000 });
  });

  // E2E TEST 8: kompletny przepływ dodawania i usuwania produktu z koszyka
  test('E2E-8: Add and remove item from bag complete flow', async ({ page }) => {
    // czekam aż produkty pojawią się na stronie
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.Loading', { state: 'hidden', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1000);
    await page.waitForSelector('.item-container', { timeout: 20000 });
    
    // dodaję produkt do koszyka
    const addButton = page.locator('.btn-add-bag').first();
    await addButton.click();
    
    // sprawdzam czy tekst przycisku zmienił się na "Remove from bag"
    await expect(addButton).toHaveText(/Remove from bag/);
    
    // klikam ponownie żeby usunąć produkt
    await addButton.click();
    
    // sprawdzam czy tekst przycisku zmienił się z powrotem na "Add to bag"
    await expect(addButton).toHaveText(/Add to bag/);
  });

  // E2E TEST 9: renderowanie stopki strony
  test('E2E-9: Footer is present and contains links', async ({ page }) => {
    const footer = page.locator('footer'); // znajduje stopkę
    await expect(footer).toBeVisible();
    // sprawdzam sekcje
    await expect(footer.locator('text=COMPANY')).toBeVisible();
    await expect(footer.locator('text=HELP & SUPPORT')).toBeVisible();
    await expect(footer.locator('text=About Us')).toBeVisible();
  });

  // E2E TEST 10: wyświetlanie informacji o produkcie
  test('E2E-10: Product details are displayed correctly', async ({ page }) => {
    // czekam aż produkty się załadują
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.Loading', { state: 'hidden', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1000);
    await page.waitForSelector('.item-container', { timeout: 20000 });
    
    const firstProduct = page.locator('.item-container').first();
    await expect(firstProduct).toBeVisible();
    
    // sprawdzam czy wszystkie elementy produktu są widoczne
    await expect(firstProduct.locator('.company-name')).toBeVisible();
    await expect(firstProduct.locator('.item-name')).toBeVisible();
    await expect(firstProduct.locator('.current-price')).toBeVisible();
    await expect(firstProduct.locator('.original-price')).toBeVisible();
  });

});
