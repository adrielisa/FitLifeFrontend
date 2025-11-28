# ⚡ REFERENCIA RÁPIDA - CHEAT SHEET

## 🎯 Patrones Implementados

### Strategy Pattern
```typescript
// Crear manager
const nutritionManager = new NutritionStrategyManager('balanced');

// Cambiar estrategia
nutritionManager.switchStrategy('keto');

// Usar
const recommendations = nutritionManager.calculateNutrientRecommendations(userProfile);
const meals = nutritionManager.suggestMeals(2000);
const isValid = nutritionManager.isCompatibleMeal(mealData);
const education = nutritionManager.getEducationalContent();

// Listar disponibles
const strategies = nutritionManager.listAvailableStrategies();

// Evaluar todas
const allEvaluations = nutritionManager.evaluateAllStrategies(userProfile);
```

---

### Observer Pattern
```typescript
// Crear observable
const goal = new Goal(goalData);
const achievement = new Achievement(achievementData);

// Registrar observadores
goal.attach(notificationService);
goal.attach(statsService);

// Notificar automáticamente
goal.updateProgress(70); // → NotificationService + StatsService se actualizan
goal.markAsAchieved();   // → Emite evento GOAL_ACHIEVED

// Usar observadores
const notifications = notificationService.getUnreadNotifications();
const stats = statsService.getStats();
```

---

### Adapter Pattern
```typescript
// Crear adaptador con factory
const connector = WearableConnectorFactory.createConnector({
    type: WearableDeviceType.GARMIN,
    userId: 'user_123',
    apiKey: 'key',
    apiSecret: 'secret'
});

// Usar (misma interfaz para cualquier dispositivo)
await connector.connect();
const deviceInfo = await connector.getDeviceInfo();
const activities = await connector.getActivityData(startDate, endDate);
const sleep = await connector.getSleepData(startDate, endDate);
const biometrics = await connector.getBiometrics();
await connector.syncData();
await connector.disconnect();

// Apple Watch (mismo código)
const apple = WearableConnectorFactory.createConnector({
    type: WearableDeviceType.APPLE_WATCH,
    userId: 'user_123'
});
await apple.connect(); // Mismo método para ambos
```

---

### Factory Method Pattern
```typescript
// Crear manager
const planManager = new ExercisePlanManager();

// Crear plan (sin usar "new" directamente)
const marathonPlan = planManager.createPlan(PlanType.MARATHON);
const muscleGainPlan = planManager.createPlan(PlanType.MUSCLE_GAIN);
const weightLossPlan = planManager.createPlan(PlanType.WEIGHT_LOSS);

// Listar disponibles
const available = planManager.listAvailablePlans();

// Registrar plan personalizado
planManager.registerFactory('custom', new CustomPlanFactory());
const customPlan = planManager.createPlan('custom' as PlanType);
```

---

## 📊 CQRS (Lectura y Escritura)

### Commands (Escribir)
```typescript
// Registrar entrenamiento
const workoutCmd = new RegisterWorkoutCommand(
    userId, planId, planName, exercises, caloriesBurned, duration,
    workoutDAO
);
const workoutId = await commandBus.execute(workoutCmd);

// Registrar comida
const mealCmd = new RegisterMealCommand(
    userId, date, 'breakfast', 'Pan con mantequilla', 2, 'rebanadas',
    360, { proteins: 8, carbohydrates: 45, fats: 12 },
    mealDAO
);
const mealId = await commandBus.execute(mealCmd);

// Crear objetivo
const goalCmd = new CreateGoalCommand(
    userId, 'Bajar 5kg', 'weight_loss', 65, 'kg',
    new Date('2025-12-31'),
    'Perder peso de forma saludable',
    goalDAO
);
const goalId = await commandBus.execute(goalCmd);

// Actualizar progreso
const progressCmd = new UpdateGoalProgressCommand(goalId, 68, goalDAO);
await commandBus.execute(progressCmd);

// Actualizar métricas de usuario
const metricsCmd = new UpdateUserHealthMetricsCommand(
    userId,
    { weight: 68, activityLevel: 'high', fitnessGoal: 'muscleGain' },
    userDAO
);
await commandBus.execute(metricsCmd);
```

### Queries (Leer)
```typescript
// Obtener resumen del dashboard
const dashboardQuery = new GetDashboardSummaryQuery(userId, dashboardDAO);
const dashboard = await queryBus.execute(dashboardQuery, `dashboard_${userId}`);

// Obtener progreso de entrenamientos
const workoutQuery = new GetWorkoutProgressQuery(userId, workoutDAO);
const progress = await queryBus.execute(workoutQuery);

// Obtener nutrición del día
const nutritionQuery = new GetDailyNutritionQuery(userId, today, mealDAO);
const nutrition = await queryBus.execute(nutritionQuery);

// Obtener objetivos activos
const goalsQuery = new GetActiveGoalsQuery(userId, goalDAO);
const goals = await queryBus.execute(goalsQuery);

// Obtener logros desbloqueados
const achievementsQuery = new GetUserAchievementsQuery(userId, achievementDAO);
const achievements = await queryBus.execute(achievementsQuery);

// Obtener estadísticas
const statsQuery = new GetUserStatsQuery(userId, statsDAO);
const stats = await queryBus.execute(statsQuery);

// Con caching automático
const cached = await queryBus.execute(statsQuery, 'user_123_stats'); // Usa cache
queryBus.invalidateCache('user_123_stats'); // Invalidar
```

---

## 🗄️ DAOs (Acceso a Datos)

### Usar DAOs
```typescript
import { UserDAOMock, WorkoutDAOMock, MealDAOMock, GoalDAOMock } from '@services/data/daos/DAOs';

// Crear instancias (mocks para desarrollo)
const userDAO = new UserDAOMock();
const workoutDAO = new WorkoutDAOMock();
const mealDAO = new MealDAOMock();
const goalDAO = new GoalDAOMock();

// Usar en Commands
const cmd = new RegisterWorkoutCommand(
    userId, planId, planName, exercises, calories, duration,
    workoutDAO // ← Inyectar DAO
);
await commandBus.execute(cmd);

// Usar en Queries
const query = new GetWorkoutProgressQuery(userId, workoutDAO);
const progress = await queryBus.execute(query);
```

### Cambiar a BD Real (después)
```typescript
// Cambiar de Mock a Real - UNA línea
// const workoutDAO: IWorkoutDAO = new WorkoutDAOMock();
const workoutDAO: IWorkoutDAO = new WorkoutDAOPostgres(connectionString);

// Commands y Queries funcionan sin cambios
```

---

## 📝 DTOs (Transferencia de Datos)

```typescript
import { 
    UserProfileDTO, 
    WorkoutSessionDTO, 
    DailyNutritionDTO, 
    GoalDTO 
} from '@services/cqrs/DTOs';

// Query retorna DTO (no la entidad completa)
const user: UserProfileDTO = await queryBus.execute(userQuery);
const workout: WorkoutSessionDTO = await queryBus.execute(workoutQuery);
const nutrition: DailyNutritionDTO = await queryBus.execute(nutritionQuery);
const goal: GoalDTO = await queryBus.execute(goalQuery);

// DTOs incluyen solo campos necesarios
console.log(user.id);         // ✅ Incluido
console.log(user.email);      // ✅ Incluido
console.log(user.passwordHash); // ❌ No incluido en DTO
```

---

## 🎯 Flujo Completo

### Registrar un Entrenamiento
```typescript
import { CommandBus, RegisterWorkoutCommand } from '@services/cqrs/commands/Commands';
import { QueryBus, GetWorkoutProgressQuery } from '@services/cqrs/queries/Queries';
import { WorkoutDAOMock } from '@services/data/daos/DAOs';

// 1. Preparar DAO
const workoutDAO = new WorkoutDAOMock();

// 2. Crear Command
const registerCmd = new RegisterWorkoutCommand(
    userId: 'user_123',
    planId: 'plan_1',
    planName: 'Plan de Maratón',
    exercises: [
        { name: 'Carrera 10km', sets: 1, reps: 1, duration: 45 }
    ],
    caloriesBurned: 800,
    duration: 45,
    workoutRepository: workoutDAO
);

// 3. Ejecutar Command (con validación automática)
const commandBus = new CommandBus();
const workoutId = await commandBus.execute(registerCmd);
// Resultado: ✅ Entrenamiento guardado, observadores notificados

// 4. Leer datos (Query)
const progressQuery = new GetWorkoutProgressQuery('user_123', workoutDAO);
const queryBus = new QueryBus();
const progress = await queryBus.execute(progressQuery);
// Resultado: { totalSessions: 1, totalDuration: 45, totalCaloriesBurned: 800 }
```

---

## 🏗️ Inyección de Dependencias

### DIContainer (Centralizado)
```typescript
// src/services/DIContainer.ts
import { CommandBus } from '@services/cqrs/commands/Commands';
import { QueryBus } from '@services/cqrs/queries/Queries';
import { UserDAOMock, WorkoutDAOMock } from '@services/data/daos/DAOs';
import { NutritionStrategyFactory } from '@services/nutrition/strategies/NutritionStrategyManager';

export class DIContainer {
    private static instance: DIContainer;

    private commandBus = new CommandBus();
    private queryBus = new QueryBus();
    private userDAO = new UserDAOMock();
    private workoutDAO = new WorkoutDAOMock();
    private nutritionManager = NutritionStrategyFactory.createManager();

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    getCommandBus() { return this.commandBus; }
    getQueryBus() { return this.queryBus; }
    getNutritionManager() { return this.nutritionManager; }
    // ... etc
}

// Usar en componentes
const di = DIContainer.getInstance();
const commandBus = di.getCommandBus();
const queryBus = di.getQueryBus();
```

---

## 🧪 Testing con Mocks

```typescript
// Usar DAOs Mock para testing
const userDAO = new UserDAOMock();
const workoutDAO = new WorkoutDAOMock();

// Crear comando
const cmd = new RegisterWorkoutCommand(
    'test_user', 'plan_1', 'Test Plan', 
    [{ name: 'Test Exercise', sets: 3, reps: 10, weight: 20 }],
    500, 30,
    workoutDAO
);

// Ejecutar en test
const result = await cmd.execute();
expect(result).toBeDefined();

// Verificar que fue guardado
const saved = await workoutDAO.getWorkoutSession(result);
expect(saved.duration).toBe(30);
```

---

## 🔄 Cambiar Estrategia Nutricional

```typescript
const manager = new NutritionStrategyManager('balanced');

// Usuario quiere cambiar a Keto
manager.switchStrategy('keto');

// Obtener nuevas recomendaciones
const ketoRecs = manager.calculateNutrientRecommendations(userProfile);
console.log(ketoRecs.macronutrients);
// { proteins: 115, carbohydrates: 30, fats: 130 }

// Cambiar a Vegana
manager.switchStrategy('vegan');
const veganRecs = manager.calculateNutrientRecommendations(userProfile);
console.log(veganRecs.macronutrients);
// { proteins: 95, carbohydrates: 180, fats: 95 }

// Validar que una comida es compatible
const mealData = { proteins: 30, carbohydrates: 5, fats: 20, calories: 350 };
const isVegan = manager.isCompatibleMeal(mealData);
console.log(isVegan); // true o false
```

---

## 📋 Validación en Commands

```typescript
// Commands validan automáticamente
const cmd = new RegisterMealCommand(
    userId, date, 'breakfast', '', -100, 'gramos',
    -500, { proteins: 0, carbs: 0, fats: 0 },
    mealDAO
);

try {
    await commandBus.execute(cmd);
} catch (error) {
    console.log(error.message); // "El nombre del alimento es requerido"
}
```

---

## 🎨 Tabla de Decisión

| Necesito... | Uso... | Ubicación |
|-------------|-------|-----------|
| Cambiar estrategia dinámicamente | Strategy Manager | `nutrition/strategies/` |
| Escuchar eventos de objetivos | Observable + Observers | `observer/` |
| Conectar wearable genérico | WearableConnectorFactory | `wearables/` |
| Crear plan de ejercicio | ExercisePlanManager | `exercise/factories/` |
| Guardar datos (escribir) | Command + DAO | `cqrs/commands/` |
| Obtener datos (leer) | Query + DAO | `cqrs/queries/` |
| Cambiar de BD | Implementar nuevo DAO | `data/daos/` |

---

## ✅ Checklist de Integración

- [ ] Leer `ANALISIS_DEUDA_TECNICA.md`
- [ ] Leer `GUIA_IMPLEMENTACION.md`
- [ ] Crear DIContainer en tu proyecto
- [ ] Migrar Home.tsx a usar QueryBus
- [ ] Migrar Meals.tsx a usar Strategy y CommandBus
- [ ] Crear tests con DAOs Mock
- [ ] Implementar DAOs reales (Firebase/PostgreSQL)
- [ ] Agregar validaciones adicionales en Commands
- [ ] Configurar caching en QueryBus
- [ ] Documentar APIs nuevas

---

**Última actualización:** 28 de Noviembre de 2025

