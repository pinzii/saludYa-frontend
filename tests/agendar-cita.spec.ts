import { test, expect } from '@playwright/test';

// Prueba E2E #1 (Agendar una cita exitosamente)
test('Flujo End-to-End 1: Agendar una cita en SaludYa exitosamente', async ({ page }) => {
  await page.goto('https://saludya-app.netlify.app/login');

  // Iniciar sesión
  await page.getByPlaceholder('Correo electrónico').fill('fpinzon514@gmail.com'); 
  await page.getByPlaceholder('Contraseña').fill('1919'); 
  await page.getByRole('button', { name: 'Entrar' }).click();

  // Navegar a la vista
  await page.getByText('Agendar cita').click();
  await expect(page.locator('select[name="especialidad"]')).toBeVisible({ timeout: 10000 });

  // Llenar formulario
  await page.locator('select[name="especialidad"]').selectOption({ label: 'Odontología general' });
  await page.locator('input[name="fecha"]').fill('2026-06-15');
  await page.locator('textarea[name="observaciones"]').fill('Consulta de rutina para revisión general.');
  await page.locator('button.btn-schedule').click();

  // Seleccionar y verificar
  const primerBotonSeleccionar = page.locator('.btn-select').first();
  await expect(primerBotonSeleccionar).toBeVisible();
  await primerBotonSeleccionar.click();

  const alertaExito = page.locator('.alert-success');
  await expect(alertaExito).toBeVisible();
  await expect(alertaExito).toContainText('¡Cita agendada con éxito');
});

// Prueba E2E #2 (Inicio de sesion fallido)
test('Flujo End-to-End 2: Mostrar mensaje de error con credenciales incorrectas', async ({ page }) => {
  await page.goto('https://saludya-app.netlify.app/login');

  // 1. Intentamos entrar con datos falsos
  await page.getByPlaceholder('Correo electrónico').fill('falso@ejemplo.com'); 
  await page.getByPlaceholder('Contraseña').fill('incorrecto'); 
  await page.getByRole('button', { name: 'Entrar' }).click();

  // 2. Interceptamos el recuadro rojo por su clase CSS
  const alertaError = page.locator('.alert-error');

  await alertaError.waitFor({ state: 'visible', timeout: 10000 });

  // 3. Verificamos que el cuadro rojo sea visible en la pantalla
  await expect(alertaError).toBeVisible();

  // 4. Verificamos que contenga el texto de rechazo del backend
  await expect(alertaError).toContainText('Credenciales inválidas'); 
});

// Prueba E2E #3 (Validación de campos vacíos)
test('Flujo End-to-End 3: Prevenir agendamiento si el formulario está incompleto', async ({ page }) => {
  await page.goto('https://saludya-app.netlify.app/login');

  await page.getByPlaceholder('Correo electrónico').fill('fpinzon514@gmail.com'); 
  await page.getByPlaceholder('Contraseña').fill('1919'); 
  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.getByText('Agendar cita').click();
  await expect(page.locator('select[name="especialidad"]')).toBeVisible({ timeout: 10000 });

  await page.locator('button.btn-schedule').click();

  // En lugar de esperar inmediatamente, le damos un margen al servidor
  // Esto evita que la prueba falle por "velocidad de procesamiento"
  await page.waitForTimeout(1000); 

  const alertaExito = page.locator('.alert-success');
  await expect(alertaExito).not.toBeVisible();
});