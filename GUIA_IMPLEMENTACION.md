# 📚 GUÍA DE IMPLEMENTACIÓN - PATRONES REFACTORIZADOS

## Estado Actual de la Refactorización

He completado las **3 fases** de refactorización solicitadas en el curso de Patrones de Diseño. Este documento te guía sobre cómo integrar los nuevos patrones en tu código actual.

---

## ✅ FASE 1: DIAGNÓSTICO COMPLETADA ✅

**Ubicación:** `ANALISIS_DEUDA_TECNICA.md`

Se identificaron 6 antipatrones principales:
1. Hard-coded Values
2. Código Duplicado
3. Acoplamiento Fuerte
4. Baja Cohesión
5. Spaghetti Code
6. God Object

---

## ✅ FASE 2: PATRONES GOF IMPLEMENTADOS ✅

### 1. **STRATEGY PATTERN** ✅

**Ubicación:** `src/services/nutrition/strategies/`

**Archivos:**
- `INutritionStrategy.ts` - Interface del patrón
- `KetoStrategy.ts` - Estrategia Cetogénica
- `VeganStrategy.ts` - Estrategia Vegana
- `BalancedStrategy.ts` - Estrategia Balanceada
- `NutritionStrategyManager.ts` - Manager y Factory

**Cómo Usar:**
```typescript
// ❌ ANTES (Antipatrón con if/else)
function calculateNutrients(type: string, user: User) {
    if (type === 'keto') {
        // calcular keto...
    } else if (type === 'vegan') {
        // calcular vegan...
    } else {
        // calcular balanced...
    }
}

// ✅ DESPUÉS (Patrón Strategy)
import { NutritionStrategyManager } from '@services/nutrition/strategies/NutritionStrategyManager';

const nutritionManager = new NutritionStrategyManager('balanced');
nutritionManager.switchStrategy('keto'); // Cambiar dinámicamente
const recommendations = nutritionManager.calculateNutrientRecommendations(userProfile);

// Listar todas las estrategias disponibles
const availableStrategies = nutritionManager.listAvailableStrategies();
```

---

### 2. **OBSERVER PATTERN** ✅

**Ubicación:** `src/services/observer/`

**Archivos:**
- `IObserver.ts` - Interfaces y tipos
- `Observable.ts` - Clase base Observable
- `Goal.ts` - Objeto observable (Objetivo)
- `Achievement.ts` - Objeto observable (Logro)
- `NotificationService.ts` - Observador concreto
- `StatsService.ts` - Observador concreto

**Cómo Usar:**
```typescript
import { Goal, GoalStatus } from '@services/observer/Goal';
import { NotificationService } from '@services/observer/NotificationService';
import { StatsService } from '@services/observer/StatsService';

// Crear observables
const goal = new Goal({
    id: 'goal_1',
    userId: 'user_123',
    name: 'Bajar 5kg',
    type: 'weight_loss',
    targetValue: 65,
    currentValue: 70,
    unit: 'kg',
    deadline: new Date('2025-12-31'),
    status: 'in_progress',
    createdAt: new Date(),
    updatedAt: new Date(),
});

// Registrar observadores
const notificationService = new NotificationService();
const statsService = new StatsService();

goal.attach(notificationService);
goal.attach(statsService);

// Cuando cambia el objetivo, notifica a todos los observadores
goal.updateProgress(68); // Los observadores son notificados automáticamente
goal.markAsAchieved(); // Los observadores reciben evento de logro

// Obtener notificaciones
const notifications = notificationService.getNotifications();
console.log(notifications);

// Obtener estadísticas
const stats = statsService.getStats();
console.log(stats.goalsAchieved); // +1
```

---

### 3. **ADAPTER PATTERN** ✅

**Ubicación:** `src/services/wearables/`

**Archivos:**
- `adapters/IWearableConnector.ts` - Interface del patrón
- `adapters/GarminAdapter.ts` - Adaptador para Garmin
- `adapters/AppleWatchAdapter.ts` - Adaptador para Apple Watch
- `WearableConnectorFactory.ts` - Factory para crear adaptadores

**Cómo Usar:**
```typescript
import {
    WearableConnectorFactory,
    WearableDeviceType,
} from '@services/wearables/WearableConnectorFactory';

// Crear adaptador usando factory
const garminConnector = WearableConnectorFactory.createConnector({
    type: WearableDeviceType.GARMIN,
    userId: 'user_123',
    apiKey: 'your_garmin_api_key',
    apiSecret: 'your_garmin_secret',
});

// Usar el adaptador (API común para todos los dispositivos)
await garminConnector.connect();
const deviceInfo = await garminConnector.getDeviceInfo();
const activities = await garminConnector.getActivityData(
    new Date('2025-01-01'),
    new Date()
);

// Apple Watch - misma interfaz
const appleConnector = WearableConnectorFactory.createConnector({
    type: WearableDeviceType.APPLE_WATCH,
    userId: 'user_123',
});

await appleConnector.connect();
const appleActivities = await appleConnector.getActivityData(
    new Date('2025-01-01'),
    new Date()
);

// El código cliente NO cambia, aunque el dispositivo sea diferente
// Esto es la esencia del patrón Adapter
```

---

### 4. **FACTORY METHOD PATTERN** ✅

**Ubicación:** `src/services/exercise/factories/`

**Archivo:**
- `ExercisePlanFactory.ts` - Factories para planes de ejercicio

**Cómo Usar:**
```typescript
import {
    ExercisePlanManager,
    PlanType,
} from '@services/exercise/factories/ExercisePlanFactory';

// Crear manager
const planManager = new ExercisePlanManager();

// Listar planes disponibles
const availablePlans = planManager.listAvailablePlans();
console.log(availablePlans);
// Salida:
// [
//   { type: 'marathon', name: 'Plan de Maratón', description: '...' },
//   { type: 'muscle_gain', name: 'Plan de Ganancia Muscular', description: '...' },
//   { type: 'weight_loss', name: 'Plan de Pérdida de Peso', description: '...' }
// ]

// Crear un plan (SIN usar "new" directamente)
const marathonPlan = planManager.createPlan(PlanType.MARATHON);
console.log(marathonPlan.name); // "Plan de Maratón"
console.log(marathonPlan.exercises); // Array de ejercicios

// La ventaja: puedes agregar nuevos planes sin modificar el cliente
// Solo implementas IPlanFactory e IPlanFactory y los registras

// Ejemplo: Crear un plan personalizado
class CustomPlan implements IExercisePlan {
    name = 'Mi Plan Personalizado';
    // ... implementar interfaz
}

class CustomPlanFactory implements IPlanFactory {
    createPlan(): IExercisePlan {
        return new CustomPlan();
    }
}

planManager.registerFactory('custom', new CustomPlanFactory());
const customPlan = planManager.createPlan('custom' as PlanType);
```

---

## ✅ FASE 3: ARQUITECTURA ESCALABLE IMPLEMENTADA ✅

### 1. **CQRS** ✅

**Ubicación:** `src/services/cqrs/`

**Archivos:**
- `DTOs.ts` - Data Transfer Objects
- `commands/Commands.ts` - Comandos (escritura)
- `queries/Queries.ts` - Queries (lectura)

**Cómo Usar:**

```typescript
import { CommandBus, RegisterWorkoutCommand } from '@services/cqrs/commands/Commands';
import { QueryBus, GetWorkoutProgressQuery } from '@services/cqrs/queries/Queries';
import { WorkoutDAOMock } from '@services/data/daos/DAOs';

// Configurar buses
const commandBus = new CommandBus();
const queryBus = new QueryBus();

// Registrar DAOs
const workoutDAO = new WorkoutDAOMock();

// LADO DE ESCRITURA (Commands)
const registerWorkoutCmd = new RegisterWorkoutCommand(
    userId: 'user_123',
    planId: 'plan_1',
    planName: 'Plan de Maratón',
    exercises: [
        { name: 'Carrera 10km', sets: 1, reps: 1, duration: 45 },
    ],
    caloriesBurned: 800,
    duration: 45,
    workoutRepository: workoutDAO
);

const workoutId = await commandBus.execute(registerWorkoutCmd);
console.log(`Entrenamiento registrado: ${workoutId}`);

// LADO DE LECTURA (Queries)
const getProgressQuery = new GetWorkoutProgressQuery('user_123', workoutDAO);
const progress = await queryBus.execute(getProgressQuery, 'user_123_progress');

console.log(progress);
// {
//   totalSessions: 15,
//   totalDuration: 750,
//   totalCaloriesBurned: 12000
// }
```

**Ventajas:**
- ✅ Separación clara entre lectura y escritura
- ✅ Comandos pasan por validaciones y reglas de negocio
- ✅ Queries optimizadas sin lógica de negocio
- ✅ Caching automático de queries
- ✅ Escalabilidad: puedes replicar bases de datos de lectura

---

### 2. **DATA ACCESS OBJECTS (DAOs)** ✅

**Ubicación:** `src/services/data/daos/`

**Archivo:**
- `DAOs.ts` - Interfaces y implementaciones Mock

**Cómo Usar:**

```typescript
import {
    IUserDAO,
    IWorkoutDAO,
    UserDAOMock,
    WorkoutDAOMock,
} from '@services/data/daos/DAOs';

// Inyectar DAOs en Commands y Queries
const userDAO: IUserDAO = new UserDAOMock();
const workoutDAO: IWorkoutDAO = new WorkoutDAOMock();

// Los DAOs abstraen la persistencia
// Puedes cambiar de SQLite a PostgreSQL sin afectar Commands/Queries

// Ejemplo: cambiar a implementación real
// class UserDAOPostgres implements IUserDAO { /* implementar */ }
// const userDAO: IUserDAO = new UserDAOPostgres();
```

---

## 🚀 PASOS PARA INTEGRAR EN TU PROYECTO

### PASO 1: Actualizar Home.tsx

```typescript
// ANTES: Datos hardcodeados
const Home: React.FC = () => {
    const consumed = 580;
    const total = 2000;
    // ...
};

// DESPUÉS: Con CQRS y Strategy
import { QueryBus, GetDashboardSummaryQuery } from '@services/cqrs/queries/Queries';
import { NutritionStrategyManager } from '@services/nutrition/strategies/NutritionStrategyManager';

const Home: React.FC<{ userId: string }> = ({ userId }) => {
    const [dashboard, setDashboard] = useState(null);
    const [nutritionManager] = useState(() => new NutritionStrategyManager());

    useEffect(() => {
        // Usar Query para obtener datos
        const queryBus = new QueryBus();
        const query = new GetDashboardSummaryQuery(userId, userDAO);
        queryBus.execute(query, `dashboard_${userId}`).then(setDashboard);
    }, [userId]);

    // Cambiar estrategia de nutrición dinámicamente
    const handleStrategyChange = (strategy: string) => {
        nutritionManager.switchStrategy(strategy);
    };

    return <div>{/* Renderizar con datos reales */}</div>;
};
```

### PASO 2: Crear servicio de inyección de dependencias

```typescript
// src/services/DIContainer.ts
import { CommandBus } from '@services/cqrs/commands/Commands';
import { QueryBus } from '@services/cqrs/queries/Queries';
import { UserDAOMock, WorkoutDAOMock, MealDAOMock } from '@services/data/daos/DAOs';
import { NutritionStrategyFactory } from '@services/nutrition/strategies/NutritionStrategyManager';

export class DIContainer {
    private static instance: DIContainer;

    private commandBus = new CommandBus();
    private queryBus = new QueryBus();
    private userDAO = new UserDAOMock();
    private workoutDAO = new WorkoutDAOMock();
    private mealDAO = new MealDAOMock();
    private nutritionManager = NutritionStrategyFactory.createManager('balanced');

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    getCommandBus() { return this.commandBus; }
    getQueryBus() { return this.queryBus; }
    getUserDAO() { return this.userDAO; }
    getWorkoutDAO() { return this.workoutDAO; }
    getMealDAO() { return this.mealDAO; }
    getNutritionManager() { return this.nutritionManager; }
}
```

### PASO 3: Usar en componentes

```typescript
import { DIContainer } from '@services/DIContainer';

const MyComponent: React.FC = () => {
    const di = DIContainer.getInstance();
    const queryBus = di.getQueryBus();
    const commandBus = di.getCommandBus();

    const handleLogWorkout = async () => {
        const cmd = new RegisterWorkoutCommand(
            userId, planId, planName, exercises, calories, duration,
            di.getWorkoutDAO()
        );
        await commandBus.execute(cmd);
    };

    // ...
};
```

---

## 📊 TABLA DE ARCHIVOS CREADOS

| Patrón | Carpeta | Archivos Principales |
|--------|---------|---------------------|
| Strategy | `src/services/nutrition/strategies/` | INutritionStrategy.ts, KetoStrategy.ts, VeganStrategy.ts, BalancedStrategy.ts, NutritionStrategyManager.ts |
| Observer | `src/services/observer/` | IObserver.ts, Observable.ts, Goal.ts, Achievement.ts, NotificationService.ts, StatsService.ts |
| Adapter | `src/services/wearables/adapters/` | IWearableConnector.ts, GarminAdapter.ts, AppleWatchAdapter.ts, WearableConnectorFactory.ts |
| Factory Method | `src/services/exercise/factories/` | ExercisePlanFactory.ts |
| CQRS | `src/services/cqrs/` | DTOs.ts, commands/Commands.ts, queries/Queries.ts |
| DAO | `src/services/data/daos/` | DAOs.ts |

---

## ✨ BENEFICIOS DE LA REFACTORIZACIÓN

### Antes (Antipatrones)
- ❌ Datos hardcodeados
- ❌ Código duplicado en múltiples archivos
- ❌ Acoplamiento a librerías específicas
- ❌ Imposible cambiar de BD sin reescribir lógica
- ❌ Difícil de testear
- ❌ Imposible agregar nuevos tipos sin modificar cliente

### Después (Patrones SOLID)
- ✅ Datos dinámicos obtenidos via CQRS
- ✅ Código reutilizable y DRY
- ✅ Desacoplado de detalles de implementación
- ✅ Cambiar BD solo requiere nuevo DAO
- ✅ Fácil de testear con DAOs Mock
- ✅ Agregar nuevos tipos usando Factory Method

---

## 🔄 PRÓXIMOS PASOS RECOMENDADOS

1. **Migrar Home.tsx** a usar QueryBus y eliminar hardcoded values
2. **Migrar Meals.tsx** a usar Strategy Pattern y CommandBus
3. **Crear React Context** para proveer DIContainer a toda la app
4. **Implementar DAOs reales** (Firestore, PostgreSQL, etc.)
5. **Agregar validaciones** en Commands antes de ejecutar
6. **Crear tests unitarios** para Commands, Queries y Strategies

---

## 📝 RESUMEN

Has completado una refactorización profesional siguiendo:
- ✅ GRASP principles
- ✅ Patrones GoF (Strategy, Observer, Adapter, Factory)
- ✅ Arquitectura CQRS
- ✅ Capa de acceso a datos (DAO)
- ✅ Separación de responsabilidades
- ✅ Alta cohesión y bajo acoplamiento

**Tu código ahora es:**
- 🏗️ Escalable
- 🧪 Testeable
- 🔄 Mantenible
- 📦 Modular
- 🎯 Profesional

¡Felicidades! 🎉

