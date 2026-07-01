# Memoria de Trabajo - 30 de Junio, 2026

Este archivo sirve como contexto resumido para retomar el desarrollo del microservicio `ms-sandbox` mañana.

---

## 1. Estado Actual del Proyecto
El servicio ha sido migrado por completo desde `utransfer-ms-core` (Middy + Inversify) a **NestJS** sobre **AWS Lambda** y está desplegado y funcional.

- **Compilador:** Webpack fue descartado. Se utiliza `serverless-esbuild` para compilaciones rápidas y livianas.
- **Enrutamiento (Proxy):** API Gateway está configurado en modo Proxy total (`/{proxy+}` y `/`) hacia la función lambda `nutriplan` (antes llamada `compute`).
- **Módulos NestJS:**
  Se crearon 4 módulos en `src/modules/` para estructurar el negocio:
  - `Users` (Login básico paciente o coach): Endpoint `GET /users/health`.
  - `Patients`: Endpoint `GET /patients/health`.
  - `NutritionalPlan`: Endpoint `GET /nutritional-plan/health`.
  - `Evaluation`: Endpoint `GET /evaluation/health`.

---

## 2. Resoluciones Clave del Día

### A. Prefijo del Custom Domain (404)
Al consumir mediante la URL de producción (`https://api-nutriplan-dev.leonardomedina.com.ec/sandbox/...`), NestJS respondía con un `404 Not Found` porque el base path `/sandbox` no estaba mapeado en los controladores.
*   **Solución:** Se implementó una lógica de reemplazo en el punto de entrada [src/lambda.ts](file:///Users/leone/Documents/ERIKA/BACKEND/nutriplan-ms-sandbox/src/lambda.ts) que limpia dinámicamente el prefijo del nombre del microservicio (leído de `process.env.MS_NAME`) en las variables `event.path`, `event.requestContext.path` y `event.rawPath` antes de inicializar Express.

### B. Ecosistema de Errores
Se descartó el Exception Filter acoplado al core antiguo, delegando el ciclo de vida de los errores al motor nativo de NestJS, pero preservando las reglas de negocio anteriores:
*   [AppException.ts](file:///Users/leone/Documents/ERIKA/BACKEND/nutriplan-ms-sandbox/src/infrastructure/AppException.ts): Extiende `HttpException` de NestJS. Lee `.utransferrc` usando `rcfile` para obtener el `errorPrefix` (ej. `SBOX`) y formatea dinámicamente el `code` y el `name` (ej. `SBOX001` y `UTR-001`).
*   [AllExceptionsFilter.ts](file:///Users/leone/Documents/ERIKA/BACKEND/nutriplan-ms-sandbox/src/infrastructure/AllExceptionsFilter.ts): Filtro global (`@Catch()`) registrado en `lambda.ts`. Captura errores genéricos inesperados (`E002`) y formatea las respuestas HTTP de forma unificada.

### C. Importación de JSON Schemas en Esbuild
Esbuild no copia carpetas de archivos estáticos por defecto (como `src/schema/`).
*   **Solución:** Creamos [src/schema/index.ts](file:///Users/leone/Documents/ERIKA/BACKEND/nutriplan-ms-sandbox/src/schema/index.ts) para importar estáticamente los JSON del esquema usando `require()`. Esto hace que esbuild los empaquete dentro del archivo `lambda.js` final, evitando operaciones `fs.readFileSync` lentas en tiempo de ejecución.
*   Se configuró `ajv-draft-04` para la validación estricta del JSON schema.

### D. Abstracción de Base de Datos (DynamoDB con RxJS)
Se implementó una pasarela de datos reactiva para interactuar con AWS DynamoDB sin arrastrar dependencias pesadas de contenedores antiguos.
*   [DynamoGateway.ts](file:///Users/leone/Documents/ERIKA/BACKEND/nutriplan-ms-sandbox/src/infrastructure/database/DynamoGateway.ts): Servicio `@Injectable()` nativo de NestJS que utiliza `aws-sdk` (v2) y **RxJS Observables** (`getItem`, `put`, `query`, `updateItem`, `deleteItem`).
*   [DynamoUpdateActionsEnum.ts](file:///Users/leone/Documents/ERIKA/BACKEND/nutriplan-ms-sandbox/src/infrastructure/database/DynamoUpdateActionsEnum.ts): Enum que define las acciones atómicas de DynamoDB (`ADD`, `SET`, `REMOVE`, `DELETE`).
*   [database.module.ts](file:///Users/leone/Documents/ERIKA/BACKEND/nutriplan-ms-sandbox/src/infrastructure/database/database.module.ts): Módulo decorado como `@Global()`. Permite que cualquier servicio inyecte `DynamoGateway` directamente en su constructor sin declarar importaciones redundantes.
*   Se integró como demostración de uso dentro de [users.service.ts](file:///Users/leone/Documents/ERIKA/BACKEND/nutriplan-ms-sandbox/src/modules/users/users.service.ts).

---

## 3. Pendientes / Siguientes Pasos
- Implementar la lógica del login básico en `UsersService` consumiendo los métodos reactivos de `DynamoGateway`.
- Conectar controladores reales en `Patients`, `NutritionalPlan` y `Evaluation` con base de datos u otros microservicios cuando se defina.
- Verificar logs en CloudWatch para asegurar que no se filtren errores no controlados.
