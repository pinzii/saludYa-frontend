import { test, expect } from '@playwright/test';

test('Flujo End-to-End: Agendar una cita en SaludYa exitosamente', async ({ page }) => {
  // 1. Visitar la app
  await page.goto('https://saludya-app.netlify.app');

  // 2. Iniciar sesión exitosamente
  await page.getByPlaceholder('Correo electrónico').fill('fpinzon514@gmail.com'); 
  await page.getByPlaceholder('Contraseña').fill('1919'); 
  await page.getByRole('button', { name: 'Entrar' }).click();

  
  // Le decimos al robot que haga clic en la opción del menú lateral para ir a la vista correcta
  await page.getByText('Agendar cita').click();
  
  // Esperamos a que el formulario de agendamiento aparezca en pantalla
  await expect(page.locator('select[name="especialidad"]')).toBeVisible({ timeout: 10000 });
  // --------------------------

  // 3. Llenar el formulario
  await page.locator('select[name="especialidad"]').selectOption({ label: 'Odontología general' });
  await page.locator('input[name="fecha"]').fill('2026-06-15');
  await page.locator('textarea[name="observaciones"]').fill('Consulta de rutina para revisión general.');

  // 4. Buscar disponibilidad
  await page.locator('button.btn-schedule').click();

  // 5. Seleccionar la primera cita de la lista
  const primerBotonSeleccionar = page.locator('.btn-select').first();
  await expect(primerBotonSeleccionar).toBeVisible();
  await primerBotonSeleccionar.click();

  // 6. Verificar la alerta de éxito
  const alertaExito = page.locator('.alert-success');
  await expect(alertaExito).toBeVisible();
  await expect(alertaExito).toContainText('¡Cita agendada con éxito');
});