Ran command: `git status -s`

El sistema de **Inversión de Control (IoC)** y **Inyección de Dependencias (DI)** en este proyecto está implementado de forma modular e integrada con el núcleo (`utransfer-ms-core`), utilizando la biblioteca **InversifyJS** y la API de reflexión de metadatos (`reflect-metadata`).

A continuación te detallo cómo está estructurado y cómo funciona:

---

### 1. Los Tokens de Identificación (`src/constant/Identifiers.ts`)
Para evitar el acoplamiento fuerte entre clases, Inversify utiliza identificadores (generalmente `Symbols`) para registrar y solicitar dependencias.
* En [Identifiers.ts](file:///Users/leone/Documents/ERIKA/BACKEND/nutriplan-ms-sandbox/src/constant/Identifiers.ts) se definen e identifican las dependencias locales del microservicio:
  ```typescript
  export type containerSymbol = {
    AwsDocumentClient: symbol;
    InitService: symbol;
  };

  const IDENTIFIERS: containerSymbol = {
    AwsDocumentClient: Symbol.for("AwsDocumentClient"),
    InitService: Symbol.for("InitService"),
  };
  ```

### 2. Configuración y Fusión del Contenedor (`src/infrastructure/Container.ts`)
El archivo [Container.ts](file:///Users/leone/Documents/ERIKA/BACKEND/nutriplan-ms-sandbox/src/infrastructure/Container.ts) es el **Composition Root** del microservicio. Aquí es donde se configuran los enlaces (*bindings*):

1. **Creación del contenedor local (`CONT_APP`)**: Se instancia un contenedor específico para el microservicio:
   ```typescript
   const CONT_APP: Container = new Container();
   ```
2. **Definición de bindings**:
   * **Valores Constantes**: El sistema de gestión de errores del Core se inyecta pasándole el mapa local de errores `ERRORS`:
     ```typescript
     CONT_APP.bind<UtransferErrors<ErrorCode>>(ID_CORE.UtransferErrors).toConstantValue(ERRORS);
     ```
   * **Clases**: Se asocia la interfaz `IInitService` con la clase concreta `InitService`:
     ```typescript
     CONT_APP.bind<IInitService>(IDENTIFIERS.InitService).to(InitService);
     ```
   * **Valores Dinámicos**: El cliente de DynamoDB (`DocumentClient`) se inicializa bajo demanda usando `toDynamicValue`, permitiendo pasarle el logger obtenido del contenedor del Core:
     ```typescript
     CONT_APP.bind<DocumentClient>(IDENTIFIERS.AwsDocumentClient).toDynamicValue(
       () => new DocumentClient({
         convertEmptyValues: true,
         logger: CONT_CORE.get<ILogger>(ID_CORE.Logger),
       })
     );
     ```
3. **Fusión con el Core**: Se utiliza `Container.merge(CONT_CORE, CONT_APP)` para unir el contenedor base del core (`utransfer-ms-core/lib`) con el del microservicio local. Esto permite reutilizar dependencias globales como `ID_CORE.Handler`, `ID_CORE.Logger` o `ID_CORE.Rollbar`.

### 3. Declaración de Dependencias (`src/service/InitService.ts`)
Las clases que van a ser inyectadas deben decorarse con `@injectable()`.
* En [InitService.ts](file:///Users/leone/Documents/ERIKA/BACKEND/nutriplan-ms-sandbox/src/service/InitService.ts) vemos:
  ```typescript
  @injectable()
  export class InitService implements IInitService { ... }
  ```
* Si `InitService` necesitara base de datos en el futuro, se inyectaría mediante constructor utilizando `@inject`:
  ```typescript
  constructor(
    @inject(IDENTIFIERS.AwsDocumentClient) private docClient: DocumentClient
  ) {}
  ```

### 4. Resolución en Tiempo de Ejecución (`src/handler/init/InitHandler.ts`)
La resolución de dependencias ocurre en el Handler al recibir una petición:
1. El Handler obtiene la instancia global del enrutador/manejador de lambdas (`IHandler`) y de Rollbar del contenedor:
   ```typescript
   const CORE: IHandler = CONTAINER.get<IHandler>(ID.Handler);
   ```
2. Al ejecutar la función `CORE.run`, se le pasa el token `IDENTIFIERS.InitService`, el método a invocar (`"compute"`) y el contenedor de dependencias (`CONTAINER`):
   ```typescript
   CORE.run<IInitService, IAPIGatewayEvent<InitRequest>>(
     IDENTIFIERS.InitService,
     "compute",
     CONTAINER,
     ROLLBAR
   )
   ```
3. Internamente, `CORE.run` hace lo siguiente:
   * Re-vincula el contexto de AWS Lambda y la instancia de Rollbar en el contenedor para que estén disponibles durante la duración de la petición.
   * Resuelve dinámicamente el servicio solicitando la instancia al contenedor: `container.get(service)` (que retorna una instancia de `InitService`).
   * Llama al método `compute` de dicha instancia.

---

### Resumen de Beneficios de este diseño de IoC:
* **Fácil Testing**: Se pueden inyectar mocks/stubs en los tests unitarios sustituyendo los enlaces del contenedor en lugar de mockear módulos con imports.
* **Separación de Responsabilidades**: Las capas de transporte (Handlers) no saben cómo se implementan los servicios (`InitService`), y los servicios no saben de dónde provienen sus dependencias (como `DocumentClient`).
* **Modularidad y Extensibilidad**: Si se cambia la implementación de `InitService` por otra (ej. `MySQLInitService`), solo es necesario cambiar una línea en `Container.ts` sin tocar los Handlers.