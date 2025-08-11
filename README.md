#Buscar Usuario de Github

Una aplicación web moderna que permite buscar usuarios de GitHub y visualizar sus perfiles de manera elegante. Construida con **Web Components** y **TypeScript** siguiendo las mejores prácticas de desarrollo frontend.

![GitHub User Search Preview](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Web Components](https://img.shields.io/badge/Web_Components-29E1FF?style=for-the-badge&logo=webcomponents.org&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

##Características

###**Funcionalidades Principales**
- **Búsqueda de usuarios** - Busca cualquier usuario de GitHub por nombre
- **Responsive Design** - Optimizada para desktop y móvil
- **Tiempo real** - Búsqueda instantánea con validación
- **UI moderna** - Interfaz limpia y atractiva
- **Accesible** - Cumple estándares WCAG con ARIA

###**Características Técnicas**
- **Web Components** - Componentes reutilizables y modulares
- **TypeScript** - Código tipado y robusto
- **Testing completo** - Suite de tests con Jest
- **Build optimizado** - Empaquetado con Vite
- **Zero dependencies** - Sin frameworks externos

##Arquitectura

###**Estructura del proyecto**
```
prueba-tecnica/
├── src/
│   ├── components/           # Web Components
│   │   ├── busca-github.ts   # Componente principal de búsqueda
│   │   ├── tarjeta-usuario.ts # Tarjeta de perfil de usuario
│   │   ├── estado-display.ts # Estados (loading, error, empty)
│   │   └── indicador-carga.ts # Spinner de carga
│   ├── services/
│   │   └── github-service.ts # Servicio API de GitHub
│   ├── types/
│   │   ├── github.ts         # Tipos de datos de GitHub
│   │   └── events.ts         # Tipos de eventos personalizados
│   ├── __tests__/            # Tests unitarios e integración
│   ├── style.css            # Estilos globales
│   └── main.ts              # Punto de entrada
├── public/                  # Archivos estáticos
├── jest.config.cjs         # Configuración de Jest
├── tsconfig.json           # Configuración TypeScript
├── package.json            # Dependencias y scripts
└── README.md               # Este archivo
```

###**Componentes Web**

#### `<busca-github>`
Componente principal que orquesta toda la funcionalidad:
- Formulario de búsqueda con validación
- Gestión del estado de carga
- Manejo de errores y cancelación de requests
- Comunicación entre componentes via custom events

#### `<tarjeta-usuario>`
Tarjeta elegante para mostrar el perfil del usuario:
- Avatar, nombre y biografía
- Contador de repositorios públicos
- Enlace al perfil de GitHub
- Responsive design adaptativo

#### `<estado-display>`
Componente unificado para estados de la aplicación:
- Mensajes informativos, de éxito y error
- Estados vacíos con iconos
- Estados híbridos con múltiples elementos
- Accesibilidad completa con ARIA

#### `<indicador-carga>`
Spinner de carga minimalista:
- Animación CSS pura
- Visibilidad controlada por atributos
- Optimizado para performance

##Inicio Rápido

###**Requisitos**
- **Node.js** 18+ 
- **npm** 9+

###**Instalación**

1. **Clona el repositorio**
```bash
git clone <url-repositorio>
cd prueba-tecnica
```

2. **Instala dependencias**
```bash
npm install
```

3. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

4. **Abre tu navegador**
```
http://localhost:5173
```

##Scripts Disponibles

###**Desarrollo**
```bash
# Servidor de desarrollo con hot reload
npm run dev

```
###**Testing**
```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch (desarrollo)
npm run test:watch

# Reporte de cobertura
npm run test:coverage
```

##Testing

### **Cobertura de Tests**
- **16 tests** distribuidos en 3 test suites
- **Componentes** - Tests unitarios para cada Web Component
- **Servicios** - Tests de integración para el GitHub API
- **Casos edge** - Manejo de errores y estados límite

### **Casos de Prueba**

#### **GitHub Service (`github-service.test.ts`)**
- ✅ Respuestas exitosas con datos válidos
- ✅ Error 404 - Usuario no encontrado
- ✅ Error 403 - Límite de requests excedido
- ✅ Errores de red y conectividad
- ✅ Cancelación de requests (AbortController)

#### **Tarjeta Usuario (`tarjeta-usuario.test.ts`)**
- ✅ Renderizado correcto de datos completos
- ✅ Fallback cuando falta el nombre (usa login)
- ✅ Manejo de biografía vacía
- ✅ Limpieza al pasar usuario null

#### **Estado Display (`estado-display.test.ts`)**
- ✅ Mensajes de error con accesibilidad correcta
- ✅ Mensajes informativos y de éxito
- ✅ Estados completos con título e icono
- ✅ Estados híbridos con múltiples elementos
- ✅ Limpieza y ocultación automática

###**Ejecutar Tests**
```bash
# Tests una vez
npm test

# Tests continuos durante desarrollo
npm run test:watch

# Reporte detallado con cobertura
npm run test:coverage
```

## API de GitHub

###**Endpoint utilizado**
```
GET https://api.github.com/users/{username}
```

###**Headers recomendados**
```javascript
{
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28'
}
```

###**Datos consumidos**
```typescript
interface UsuarioGh {
  login: string           // Nombre de usuario
  name: string | null     // Nombre real
  bio: string | null      // Biografía
  public_repos: number    // Repositorios públicos
  avatar_url: string      // URL del avatar
  html_url: string        // URL del perfil
}
```

###**Limitaciones de la API**
- **60 requests/hora** para usuarios no autenticados
- **5000 requests/hora** para usuarios autenticados
- La aplicación maneja automáticamente los límites de rate limiting

##Accesibilidad

###**Características implementadas**
- **Navegación por teclado** - Todos los elementos son accesibles
- **Screen readers** - Textos alternativos y labels apropiados
- **ARIA attributes** - `aria-live`, `aria-busy`, `role` para estados
- **Color contrast** - Cumple estándares WCAG AA
- **Focus management** - Indicadores visuales claros

###**Técnicas utilizadas**
```html
<!-- Estados live para screen readers -->
<div role="status" aria-live="polite" aria-atomic="true">
  Buscando usuario...
</div>

<!-- Alerts para errores críticos -->
<div role="alert" aria-live="assertive">
  Error: Usuario no encontrado
</div>

<!-- Imágenes con texto alternativo descriptivo -->
<img alt="Avatar de octocat" src="...">
```

##Responsive Design

### 🎨 **Breakpoints**
- **Desktop**: > 480px - Layout completo con elementos en línea
- **Mobile**: ≤ 480px - Layout vertical optimizado para touch

###**Técnicas CSS utilizadas**
```css
/* Spacing fluido */
padding: clamp(1rem, 2vw, 1.5rem);

/* Tamaños adaptativos */
width: min(420px, 90%);

@media (max-width: 480px) {
  .controls { flex-direction: column; }
}
```

## Diseño

###**Sistema de colores**
```css
:root {
  --bg: #f6f4ee;       
  --text: #1f2a37;     
  --primary: #4f46e5;   
  --border: rgba(0,0,0,.12);
  --shadow: 0 6px 14px rgba(0,0,0,.08);
}
```

### **Principios de diseño**
- **Minimalismo** - Interfaz limpia sin distracciones
- **Consistencia** - Patrones visuales uniformes
- **Feedback** - Estados claros para cada acción
- **Performance** - Animaciones suaves y optimizadas

## Performance

### **Optimizaciones implementadas**
- **Lazy rendering** - Componentes se renderizan solo cuando es necesario
- **Request cancellation** - AbortController para evitar race conditions
- **CSS optimizado** - Variables CSS para reutilización
- **Tree shaking** - Solo el código necesario en el bundle final
- **Minimal dependencies** - Zero dependencias en runtime

### **Métricas objetivo**
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1
- **Time to Interactive** < 3s

## Tecnologías Utilizadas

### **Core**
- **[TypeScript](https://www.typescriptlang.org/)** - Lenguaje principal con tipado estático
- **[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)** - Componentes nativos del navegador
- **[Vite](https://vitejs.dev/)** - Build tool y dev server ultrarrápido

### **Testing**
- **[Jest](https://jestjs.io/)** - Framework de testing
- **[Testing Library](https://testing-library.com/)** - Utilidades para testing de DOM
- **[ts-jest](https://kulshekhar.github.io/ts-jest/)** - Preset TypeScript para Jest

### **Styling**
- **CSS Vanilla** - Sin frameworks, máximo control
- **CSS Custom Properties** - Variables CSS para theming
- **CSS Grid & Flexbox** - Layouts modernos y flexibles


## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).


