# 🔍 ANÁLISIS DE DEUDA TÉCNICA - FitLife Frontend
## Diagnóstico de Antipatrones y Problemas de Arquitectura

**Fecha:** 28 de Noviembre de 2025  
**Proyecto:** FitLife Frontend (Unidad 1)  
**Versión:** Análisis Inicial

---

## 📋 RESUMEN EJECUTIVO

Se han identificado **6 antipatrones principales** y múltiples violaciones de principios GRASP en la arquitectura actual. Estos generan deuda técnica acumulada que dificulta mantenibilidad, escalabilidad y testabilidad.

---

## 🔴 ANTIPATRONES DETECTADOS

### 1. **HARD-CODED VALUES (Valores Codificados en Duro)**

#### 📍 Ubicación Principal
- **Archivo:** `src/pages/Home/Home.tsx` (Líneas 7-8)
- **Archivo:** `src/pages/Meals/Meals.tsx` (Líneas 8-9)
- **Archivo:** `src/pages/Exercises/ExercisePlanSelection.tsx` (Líneas 38-53)

#### ❌ Problemas Identificados

**Ejemplo 1 - Home.tsx:**
```typescript
// ANTIPATRÓN: Valores hardcodeados
const consumed = 580;      // Línea 7
const total = 2000;        // Línea 8
const progress = (consumed / total) * 100;

const [weekData] = useState([
    { day: 'L', completed: true },
    { day: 'M', completed: true },
    // ... más datos hardcodeados
]);

const userAvatar = "https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg";
```

**Ejemplo 2 - ExercisePlanSelection.tsx (Líneas 38-53):**
```typescript
const defaultExerciseOptions: ExerciseOption[] = [
    { id: "brazos", name: "Brazos", imageUrl: "/img1.jpg" },
    { id: "piernas", name: "Piernas", imageUrl: "/img2.jpg" },
    // ... 6 opciones hardcodeadas con URLs fijas
];
```

**Ejemplo 3 - Meals.tsx (Líneas 11-28):**
```typescript
const recommendations = [
    {
        title: "Ensalada de verduras",
        img: "https://www.recetasnestle.com.mx/...",
        grams: "150g",
        kcal: 120,
        desc: "Una ensalada fresca..."
    },
    // ... 3 recomendaciones más hardcodeadas
];

const consumed = 580;
const total = 2000;
```

#### 📊 Por Qué Es un Antipatrón

| Aspecto | Problema |
|---------|----------|
| **Mantenibilidad** | Los cambios requieren modificar código y recompilar |
| **Datos reales** | No refleja el estado real del usuario |
| **Testing** | Imposible testear diferentes escenarios |
| **Escalabilidad** | No puede adaptarse a múltiples usuarios |
| **Principio Violated** | Information Expert (GRASP) - la lógica está en el UI |

#### ✅ Solución GRASP Recomendada

**Aplicar principios:**
- **Information Expert:** Mover datos a servicios especializados
- **Creator:** Factorías para crear objetos de datos
- **Low Coupling:** Inyectar dependencias

**Implementación:**
```typescript
// ❌ ANTES (Antipatrón)
const consumed = 580;
const [weekData] = useState([...hardcoded...]);

// ✅ DESPUÉS (Patrón)
interface ICalorieRepository {
    getUserDailyCalories(userId: string): Promise<DailyCalories>;
}

const Home: React.FC<{ calorieService: ICalorieRepository }> = ({ calorieService }) => {
    const [calories, setCalories] = useState<DailyCalories | null>(null);
    
    useEffect(() => {
        calorieService.getUserDailyCalories(userId).then(setCalories);
    }, [userId]);
    
    if (!calories) return <Loading />;
    return <div>{calories.consumed}/{calories.total}</div>;
};
```

---

### 2. **CÓDIGO DUPLICADO**

#### 📍 Ubicaciones

**Patrón 1: Progreso de calorías duplicado**
- `src/pages/Home/Home.tsx` (Líneas 60-74)
- `src/pages/Meals/Meals.tsx` (Líneas 42-56)

```typescript
// DUPLICADO EN AMBOS ARCHIVOS:
<div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
        <Flame className="text-white" />
        <span>Calorías</span>
    </div>
    <span className="text-sm text-gray-300">{consumed}/{total}</span>
</div>

<div className="w-full bg-white rounded-full h-6 overflow-hidden">
    <motion.div
        className="bg-green-600 h-6 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    />
</div>
```

**Patrón 2: Header y navegación con patrones similares**
- Ambos archivos importan y usan `Header` idénticamente (Líneas 1-15)
- Ambos usan `BottomNavigation` de forma similar
- Mismo patrón de `navigate(-1)` para volver atrás

**Patrón 3: Avatar URL duplicada**
- `src/pages/Home/Home.tsx`: `"https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg"`
- `src/pages/Exercises/ExercisesMain.tsx`: `"https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg"`
- `src/pages/Exercises/ExercisePlanSelection.tsx`: Mismo patrón

#### ❌ Por Qué Es un Antipatrón

| Impacto | Descripción |
|---------|------------|
| **Mantenimiento** | Cambiar el componente requiere 3+ modificaciones |
| **Inconsistencia** | Cambios en un lugar pueden olvidarse en otros |
| **Bug Propagation** | Si hay bug en el componente, se replica en N sitios |
| **Violación GRASP** | No respeta DRY (Don't Repeat Yourself) |

#### ✅ Solución Recomendada

**Crear componentes reutilizables:**

```typescript
// ✅ Crear: src/components/nutrition/CalorieProgressBar.tsx
interface CalorieProgressBarProps {
    consumed: number;
    total: number;
    showLabel?: boolean;
}

export const CalorieProgressBar: React.FC<CalorieProgressBarProps> = ({
    consumed,
    total,
    showLabel = true
}) => {
    const progress = (consumed / total) * 100;
    
    return (
        <div className="bg-[#2A2A2A] p-6 rounded-xl">
            {showLabel && (
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Flame className="text-white" />
                        <span>Calorías</span>
                    </div>
                    <span className="text-sm text-gray-300">{consumed}/{total}</span>
                </div>
            )}
            <div className="w-full bg-white rounded-full h-6 overflow-hidden">
                <motion.div
                    className="bg-green-600 h-6 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};

// ✅ Usar en Home.tsx y Meals.tsx:
<CalorieProgressBar consumed={580} total={2000} />
```

---

### 3. **ACOPLAMIENTO FUERTE**

#### 📍 Ubicaciones

**Problema 1: Acoplamiento a rutas (Navigation)**
- `src/pages/Home/Home.tsx` (Líneas 29-38)
- Todas las páginas tienen acoplamiento directo a `useNavigate()`
- Las funciones lanzan errores en lugar de ser inyectadas

```typescript
function onNavigateExercises(): void {
    throw new Error("Function not implemented.");  // ❌ Acoplamiento a implementación
}

function onNavigateHome(): void {
    throw new Error("Function not implemented.");  // ❌ No inyectable
}
```

**Problema 2: Componentes fuertemente acoplados a servicios**
- `Profile.tsx` importa `datosMock` directamente
- No hay inyección de dependencias
- Imposible cambiar origen de datos sin modificar componente

```typescript
// ❌ ACOPLAMIENTO FUERTE
const datosMock: DatosPerfil = { /* datos */ };
const Profile: React.FC<ProfileProps> = ({ 
    profileData = datosMock,  // Valor por defecto acoplado
}) => { }
```

**Problema 3: Servicios vacíos sin interfaz**
- `src/services/api/exerciseService.ts` - VACÍO
- `src/services/api/nutritionService.ts` - VACÍO
- Contextos vacíos sin contrato claro
- Componentes no saben qué esperar de los servicios

#### ❌ Por Qué Es un Antipatrón

| Criterio GRASP | Violación |
|----------------|-----------|
| **Low Coupling** | Los componentes conocen detalles de implementación |
| **Dependency Injection** | No hay inyección, hardcoded en componentes |
| **Abstraction** | Falta de interfaces para definir contratos |
| **Testability** | Imposible mockear servicios para testing |

#### ✅ Solución Recomendada

```typescript
// ✅ PASO 1: Crear interfaz de servicio
// src/services/contracts/ICalorieService.ts
export interface ICalorieService {
    getDailyCalories(userId: string): Promise<DailyCalories>;
    updateDailyCalories(userId: string, calories: DailyCalories): Promise<void>;
}

// ✅ PASO 2: Implementación concreta
// src/services/api/CalorieService.ts
export class CalorieService implements ICalorieService {
    constructor(private apiClient: IApiClient) {}
    
    async getDailyCalories(userId: string): Promise<DailyCalories> {
        return this.apiClient.get(`/users/${userId}/calories`);
    }
    
    async updateDailyCalories(userId: string, calories: DailyCalories): Promise<void> {
        return this.apiClient.put(`/users/${userId}/calories`, calories);
    }
}

// ✅ PASO 3: Inyectar en componente
interface HomeProps {
    calorieService: ICalorieService;
    navigationService: INavigationService;
}

const Home: React.FC<HomeProps> = ({ calorieService, navigationService }) => {
    const [calories, setCalories] = useState<DailyCalories | null>(null);
    
    useEffect(() => {
        calorieService.getDailyCalories(userId).then(setCalories);
    }, [userId, calorieService]);
    
    const handleNavigate = () => navigationService.navigateTo('/exercises');
    
    return <div>...</div>;
};

// ✅ PASO 4: Inyectar en raíz (Context Provider o DI Container)
// src/App.tsx
<DependencyProvider 
    services={{
        calorieService: new CalorieService(apiClient),
        navigationService: new NavigationService(useNavigate())
    }}
>
    <Home />
</DependencyProvider>
```

---

### 4. **BAJA COHESIÓN**

#### 📍 Ubicaciones

**Problema 1: Home.tsx maneja múltiples responsabilidades**
- Gestión de datos de calorías (línea 7-8)
- Gestión de datos semanales (línea 13-21)
- Navegación entre páginas (líneas 29-38)
- Renderizado de componentes (líneas 45-78)

```typescript
const Home: React.FC = () => {
    // ❌ Responsabilidad 1: Gestión de calorías
    const consumed = 580;
    const total = 2000;
    const progress = (consumed / total) * 100;

    // ❌ Responsabilidad 2: Gestión de datos semanales
    const [weekData] = useState([...]);

    // ❌ Responsabilidad 3: Navegación
    const navigate = useNavigate();
    function onNavigateExercises(): void { ... }
    function onNavigateHome(): void { ... }
    function onNavigateNutrition(): void { ... }

    // ❌ Responsabilidad 4: Renderizado
    return <div className="...">...</div>;
};
```

**Problema 2: ExercisePlanSelection hace demasiado**
- Gestión de ejercicios (línea 38-53)
- Gestión de selección (línea 59)
- Navegación personalizada (líneas 75-85)
- Lógica de límite de selecciones (línea 65-72)

**Problema 3: Meals.tsx mezcla lógica de negocio con presentación**
- Recomendaciones hardcodeadas (líneas 11-28)
- Lógica de cantidad (línea 73)
- Gestión de modal (línea 105)
- Múltiples handlers de navegación (líneas 51-67)

#### ❌ Por Qué Es un Antipatrón

| Aspecto | Impacto |
|---------|--------|
| **Single Responsibility** | Cada componente viola SRP |
| **Testing** | Imposible testear unidades independientes |
| **Reusabilidad** | Lógica acoplada imposible de reutilizar |
| **Mantenimiento** | Cambios pequeños requieren tocar muchos lugares |

#### ✅ Solución Recomendada

**Refactorizar separando responsabilidades:**

```typescript
// ✅ PASO 1: Crear presentación pura
// src/components/home/CaloriesCard.tsx
interface CaloriesCardProps {
    consumed: number;
    total: number;
}

export const CaloriesCard: React.FC<CaloriesCardProps> = ({ consumed, total }) => {
    const progress = (consumed / total) * 100;
    return (
        <div className="...">
            <Flame className="text-orange-500" />
            <motion.div style={{ width: `${progress}%` }} />
        </div>
    );
};

// ✅ PASO 2: Crear hook para lógica de negocio
// src/hooks/useHomeData.ts
export const useHomeData = (userId: string) => {
    const [calories, setCalories] = useState<CalorieData | null>(null);
    const [weekData, setWeekData] = useState<WeekData[] | null>(null);
    
    useEffect(() => {
        Promise.all([
            calorieService.getDailyCalories(userId),
            progressService.getWeeklyProgress(userId)
        ]).then(([cal, week]) => {
            setCalories(cal);
            setWeekData(week);
        });
    }, [userId]);
    
    return { calories, weekData, isLoading: !calories || !weekData };
};

// ✅ PASO 3: Usar en componente limpio
const Home: React.FC<{ userId: string }> = ({ userId }) => {
    const { calories, weekData, isLoading } = useHomeData(userId);
    const navigate = useNavigate();
    
    if (isLoading) return <Loading />;
    
    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white p-10 space-y-10">
            <Header isActive={true} showBackButton={true} onBack={() => navigate(-1)} />
            <CaloriesCard consumed={calories.consumed} total={calories.total} />
            <WeeklyProgress weekData={weekData} />
            <BottomNavigation onNavigateExercises={() => navigate('/exercises')} />
        </div>
    );
};
```

---

### 5. **SPAGHETTI CODE**

#### 📍 Ubicaciones

**Problema 1: ExercisePlanSelection.tsx - Lógica enredada**
- Líneas 59-72: Lógica de selección con callbacks múltiples
- Línea 73: Condición anidada dentro de handler
- Línea 75-81: Navegación intercalada con lógica de negocio

```typescript
const handleExerciseClick = (exerciseId: string) => {
    setSelectedExercises((prev) => {
        const newSelected = new Set(prev)
        if (newSelected.has(exerciseId)) {
            newSelected.delete(exerciseId)
        } else {
            if (newSelected.size < 2) {
                newSelected.add(exerciseId)
            }
        }
        return newSelected
    })

    if (onSelectExercise) {  // ❌ Callback condicional después de state update
        onSelectExercise(exerciseId)
    }
}
```

**Problema 2: Meals.tsx - Estado y lógica entrelazados**
- Línea 73: `quantity` state mezclado con recomendaciones
- Líneas 105-150: Modal con lógica de negocio inline
- Múltiples `onClick` handlers sin abstracción

```typescript
return (
    <AnimatePresence>
        {selectedMeal && (
            <motion.div className="...">
                <button className="..." onClick={() => setSelectedMeal(null)}>
                    <X />
                </button>
                <div className="...">
                    <h2>{selectedMeal.title}</h2>
                    // ... más JSX mezclado con lógica
                    <button className="..." onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                        -
                    </button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);
```

#### ❌ Por Qué Es un Antipatrón

- Difícil seguir el flujo de datos
- Estado disperso sin modelo claro
- Callbacks anidados crean dependencias ocultas
- Imposible testear lógica sin componente

#### ✅ Solución Recomendada

**Usar patrón State Machine o React Hooks estructurados:**

```typescript
// ✅ Crear hook para lógica de selección
// src/hooks/useExerciseSelection.ts
export const useExerciseSelection = (maxSelections: number = 2) => {
    const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
    
    const toggleExercise = useCallback((exerciseId: string) => {
        setSelectedExercises(prev => {
            const newSelected = new Set(prev);
            
            if (newSelected.has(exerciseId)) {
                newSelected.delete(exerciseId);
            } else if (newSelected.size < maxSelections) {
                newSelected.add(exerciseId);
            }
            
            return newSelected;
        });
    }, [maxSelections]);
    
    const isSelected = useCallback((exerciseId: string) => 
        selectedExercises.has(exerciseId), [selectedExercises]);
    
    const canAddMore = selectedExercises.size < maxSelections;
    
    return { selectedExercises, toggleExercise, isSelected, canAddMore };
};

// ✅ Usar limpiamente
const ExercisePlanSelection: React.FC = () => {
    const { selectedExercises, toggleExercise, isSelected } = useExerciseSelection();
    
    return (
        <div>
            {exercises.map(ex => (
                <ExerciseButton
                    key={ex.id}
                    exercise={ex}
                    isSelected={isSelected(ex.id)}
                    onClick={() => toggleExercise(ex.id)}
                />
            ))}
        </div>
    );
};
```

---

### 6. **GOD OBJECT (Objeto Dios)**

#### 📍 Ubicaciones

**Problema 1: Home.tsx como "página todo"**
- Contiene: datos de calorías, datos semanales, navegación, renderizado
- Importa: Header, WeeklyProgress, BottomNavigation, múltiples iconos
- Responsabilidades: UI, lógica de negocio, navegación

**Problema 2: Profile.tsx maneja demasiados datos**
- Interfaz `DatosPerfil` con 7 propiedades sin separación
- Componente renderiza todos los datos sin abstracción
- Gestiona navegación y presentación simultáneamente

```typescript
interface DatosPerfil {
    nombre: string;
    correo: string;
    edad: number;
    peso: string;
    estatura: string;
    nivelActividad: string;  // ❌ Demasiadas responsabilidades en una interfaz
    meta: string;
    urlAvatar?: string;
}
```

**Problema 3: ExercisePlanSelection hace demasiado**
- Maneja selección de ejercicios
- Maneja navegación
- Maneja datos mock
- Maneja renderizado complejo

#### ❌ Por Qué Es un Antipatrón

| Aspecto | Problema |
|---------|----------|
| **Single Responsibility** | Un componente no debe conocer todos los detalles |
| **Testabilidad** | Imposible testear sin mockear múltiples dependencias |
| **Reusabilidad** | El "dios" no se puede reutilizar sin todo |
| **Escalabilidad** | Crece incontroladamente con nuevas features |

#### ✅ Solución Recomendada

**Descomponer en componentes pequeños con responsabilidades claras:**

```typescript
// ✅ PASO 1: Separar en presentación y lógica
// src/components/profile/ProfileHeader.tsx
interface ProfileHeaderProps {
    name: string;
    avatar?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, avatar }) => (
    <div className="flex flex-col items-center">
        <img src={avatar} alt={name} className="w-32 h-32 rounded-full" />
        <h1 className="text-2xl font-bold">{name}</h1>
    </div>
);

// ✅ PASO 2: Componente para datos personales
// src/components/profile/PersonalDataSection.tsx
interface PersonalDataSectionProps {
    email: string;
    age: number;
    weight: string;
    height: string;
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({
    email, age, weight, height
}) => (
    <div className="bg-[#262626] rounded-lg p-5 space-y-4">
        <DataRow label="Correo" value={email} />
        <DataRow label="Edad" value={age.toString()} />
        <DataRow label="Peso" value={weight} />
        <DataRow label="Estatura" value={height} />
    </div>
);

// ✅ PASO 3: Componente para datos de fitness
// src/components/profile/FitnessDataSection.tsx
interface FitnessDataSectionProps {
    activityLevel: string;
    goal: string;
}

export const FitnessDataSection: React.FC<FitnessDataSectionProps> = ({
    activityLevel, goal
}) => (
    <div className="bg-[#262626] rounded-lg p-5 space-y-4">
        <DataRow label="Nivel de actividad" value={activityLevel} />
        <DataRow label="Meta" value={goal} />
    </div>
);

// ✅ PASO 4: Componedor principal - RESPONSABILIDAD ÚNICA
const Profile: React.FC<{ userId: string }> = ({ userId }) => {
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        userService.getProfile(userId).then(setProfileData);
    }, [userId]);
    
    if (!profileData) return <Loading />;
    
    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white">
            <BackButton onClick={() => navigate(-1)} />
            <ProfileHeader name={profileData.nombre} avatar={profileData.urlAvatar} />
            <PersonalDataSection
                email={profileData.correo}
                age={profileData.edad}
                weight={profileData.peso}
                height={profileData.estatura}
            />
            <FitnessDataSection
                activityLevel={profileData.nivelActividad}
                goal={profileData.meta}
            />
            <BottomNavigation />
        </div>
    );
};
```

---

## 📊 TABLA RESUMEN DE ANTIPATRONES

| Antipatrón | Ubicación | Severidad | Principios GRASP Violados |
|------------|-----------|-----------|--------------------------|
| Hard-coded Values | Home.tsx (7-8), Meals.tsx (8-9), ExercisePlanSelection.tsx (38-53) | 🔴 CRÍTICO | Information Expert, Controller |
| Código Duplicado | Home.tsx + Meals.tsx (líneas 60-74), Múltiples avatares URL | 🟠 ALTO | DRY, Reusability |
| Acoplamiento Fuerte | Toda navegación en componentes, servicios vacíos sin interfaz | 🔴 CRÍTICO | Low Coupling, Abstraction |
| Baja Cohesión | Home.tsx (múltiples responsabilidades), ExercisePlanSelection, Meals | 🟠 ALTO | Single Responsibility |
| Spaghetti Code | ExercisePlanSelection.tsx (59-72), Meals.tsx (105-150) | 🟠 ALTO | Clarity, Maintainability |
| God Object | Home.tsx, Profile.tsx, ExercisePlanSelection | 🟠 ALTO | Single Responsibility, Creator |

---

## 🎯 PRÓXIMOS PASOS (FASE 2 - REFACTORIZACIÓN)

1. **Crear capa de servicios con interfaces** (DAOs, Repositories)
2. **Implementar patrones GoF:**
   - Strategy Pattern (Nutrición)
   - Observer Pattern (Notificaciones)
   - Adapter Pattern (Wearables)
   - Factory Method (Planes de ejercicio)
3. **Implementar CQRS** (Separación Commands/Queries)
4. **Refactorizar componentes** usando los nuevos patrones

---

## 📝 CONCLUSIÓN

La arquitectura actual tiene una deuda técnica importante que dificulta:
- ❌ Escalabilidad (datos hardcodeados)
- ❌ Testabilidad (acoplamiento fuerte)
- ❌ Mantenibilidad (código duplicado y sin cohesión)
- ❌ Colaboración (no hay contratos claros entre capas)

**Acción recomendada:** Proceder con Fase 2 para implementar patrones de arquitectura que solucionen estos problemas de forma progresiva.

