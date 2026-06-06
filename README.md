# SaludYa — Frontend

Sistema web de gestión y agendamiento de citas médicas para clínicas y consultorios de pequeño y mediano tamaño en Colombia.

---

## Descripción del proyecto

**SaludYa** es una aplicación web que digitaliza el proceso de agendamiento de citas médicas, eliminando la dependencia de llamadas telefónicas y agendas físicas. Permite a los **pacientes** registrarse, agendar, consultar, cancelar y reagendar citas de forma autónoma. Los **médicos** pueden consultar su agenda de citas asignadas.

Este repositorio contiene el **frontend** de la aplicación, desarrollado con **Angular 21**.

- **Repositorio backend:** https://github.com/KerlyVanesaSarrias/backend-saludYa
- **API en producción:** https://backend-saludya.onrender.com
- **Frontend en producción:** (Dockerfile incluido para despliegue con Nginx)

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 21.2.x | Framework principal del frontend |
| TypeScript | ~5.9.2 | Lenguaje de programación |
| Bootstrap | ^5.3.8 | Estilos y componentes visuales |
| RxJS | ~7.8.0 | Manejo de observables y llamadas HTTP |
| Angular Router | 21.2.x | Navegación y guards de rutas |
| Angular HttpClient | 21.2.x | Comunicación con la API REST |
| Vitest | ^4.0.8 | Ejecución de pruebas unitarias |
| Prettier | ^3.8.1 | Formateo de código |
| Docker + Nginx | alpine | Contenerización para producción |

---

## Arquitectura general del sistema

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (Angular)                 │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  Auth    │  │  Home    │  │  Shared Components │ │
│  │  Login   │  │  Perfil  │  │  Sidebar           │ │
│  │  Register│  │  Agendar │  │  Toast             │ │
│  └──────────┘  │  Citas   │  └────────────────────┘ │
│                │  CitasMed│                          │
│                └──────────┘                          │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │         Core Layer                              │ │
│  │  AuthService  CitaService  UsersService         │ │
│  │  AuthGuard    ToastService                      │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP REST (JWT)
                           ▼
┌─────────────────────────────────────────────────────┐
│                 BACKEND (NestJS)                     │
│  /api/auth    /api/users    /api/appointments        │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   PostgreSQL (BD)   │
                └─────────────────────┘
```

### Estructura de carpetas del frontend

```
src/
├── app/
│   ├── core/
│   │   ├── guards/         # AuthGuard — protege rutas privadas
│   │   ├── models/         # Interfaces TypeScript (Cita)
│   │   └── services/       # CitaService, UsersService, ToastService
│   ├── features/
│   │   ├── auth/           # Login, Register, AuthService
│   │   ├── components/     # Sidebar compartido
│   │   └── home/           # Perfil, Agendar, Citas, CitasMedico
│   └── shared/
│       └── components/     # Toast component
├── environments/           # URLs de API por entorno
└── assets/
```

---

## Guía de instalación

### Prerrequisitos

- **Node.js** v18 o superior — [Descargar](https://nodejs.org/)
- **npm** v9 o superior (incluido con Node.js)
- **Angular CLI** v21 — se instala a continuación

### Pasos de instalación

**1. Clonar el repositorio**

```bash
git clone https://github.com/KerlyVanesaSarrias/frontend-saludYa.git
cd frontend-saludYa
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar la URL de la API**

El archivo de entorno está en `src/environments/environment.ts`. Por defecto apunta al backend en producción (Render):

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://backend-saludya.onrender.com/api',
};
```

Si deseas apuntar a un backend local, cambia `apiUrl` a:

```typescript
apiUrl: 'http://localhost:3000/api'
```

---

## Instrucciones para ejecutar localmente

### Modo desarrollo

```bash
npm start
# o equivalentemente:
ng serve
```

La aplicación estará disponible en: **http://localhost:4200**

El servidor recarga automáticamente al guardar cambios en los archivos fuente.

### Modo producción (con Docker)

```bash
# Construir la imagen
docker build -t saludya-frontend .

# Ejecutar el contenedor
docker run -p 80:80 saludya-frontend
```

La aplicación estará disponible en: **http://localhost**

### Ejecutar pruebas unitarias

```bash
npm test
```

### Compilar para producción

```bash
npm run build
# Los artefactos se generan en: dist/salud-ya/browser/
```

---

## Rutas de la aplicación

| Ruta | Componente | Acceso |
|---|---|---|
| `/login` | `LoginComponent` | Público |
| `/register` | `RegisterComponent` | Público |
| `/home/perfil` | `PerfilComponent` | Autenticado |
| `/home/agendar` | `AgendarComponent` | Autenticado |
| `/home/citas` | `CitasComponent` | Autenticado |
| `/home/citas-medico` | `CitasMedicoComponent` | Autenticado |

Las rutas bajo `/home` están protegidas por `AuthGuard`, que verifica la existencia de un JWT válido en `localStorage`. Sin token, el usuario es redirigido a `/login`.

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `environment.apiUrl` | URL base de la API REST del backend | `https://backend-saludya.onrender.com/api` |
| `environment.production` | Modo producción | `false` |

---

## Autores

- Kerly Vanessa Sarrias
- Felipe Pinzón Ruiz
- Rubén Andrés Castañeda

**Universidad Iberoamericana · Proyecto de Software · 2026**
