# Admin UI - Piggogest

Una aplicación Angular para la gestión de expedientes con autenticación Auth0 y tabla de datos.

## Características

- ✅ **Angular 17** con componentes standalone
- ✅ **Autenticación Auth0** (configuración preparada)
- ✅ **Tabla de expedientes** con datos dummy
- ✅ **Diseño moderno** con gradientes y animaciones
- ✅ **Responsive design** para diferentes dispositivos
- ✅ **Navegación** entre login y tabla de expedientes

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   │   └── login.component.ts
│   │   └── expedientes/
│   │       └── expedientes.component.ts
│   ├── models/
│   │   └── expediente.model.ts
│   ├── services/
│   │   └── expedientes.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── app.component.ts
│   └── app.routes.ts
├── main.ts
├── index.html
└── styles.scss
```

## Datos de Expedientes

La aplicación incluye datos dummy de expedientes con los siguientes campos:
- **ID**: Identificador único (EXP-001, EXP-002, etc.)
- **Estado**: Pendiente, En Proceso, Completado, Cancelado
- **Cliente**: Nombre del cliente
- **Fecha Creación**: Fecha de creación del expediente
- **Fecha Actualización**: Última fecha de modificación
- **Descripción**: Descripción del expediente

## Configuración de Auth0

Para habilitar la autenticación Auth0, actualiza el archivo `src/main.ts`:

```typescript
import { AuthModule } from '@auth0/auth0-angular';

// En el bootstrapApplication:
importProvidersFrom(
  AuthModule.forRoot({
    domain: 'tu-dominio.auth0.com',
    clientId: 'tu-client-id',
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  })
)
```

## Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm start
   ```

3. **Construir para producción:**
   ```bash
   npm run build
   ```

## Dependencias Principales

- `@angular/core`: Framework Angular
- `@angular/router`: Navegación
- `@angular/common`: Funcionalidades comunes
- `@auth0/auth0-angular`: Autenticación Auth0 (opcional)
- `ag-grid-angular`: Tabla de datos avanzada (opcional)
- `rxjs`: Programación reactiva

## Próximos Pasos

1. **Configurar Auth0** con tus credenciales reales
2. **Instalar AG Grid** para una tabla más avanzada:
   ```bash
   npm install ag-grid-angular ag-grid-community
   ```
3. **Conectar con API real** en lugar de datos dummy
4. **Añadir más funcionalidades** como filtros, búsqueda, etc.

## Notas

- La aplicación está configurada para funcionar sin Auth0 en modo demo
- Los datos de expedientes son estáticos y se cargan desde el servicio
- El diseño es completamente responsive y moderno
- Se puede navegar entre login y expedientes usando los enlaces del header