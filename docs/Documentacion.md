# Documentación del Proyecto - Sistema de Gestión de Productos

## 1. Requerimientos Funcionales

### RF01: Registro de Usuarios
**Descripción**: El sistema debe permitir a nuevos usuarios crear una cuenta.

**Criterios de Aceptación**:
- El usuario proporciona: nombre, email y contraseña
- El email debe ser único en el sistema
- La contraseña debe tener mínimo 6 caracteres
- El sistema valida el formato del email
- Al registrarse exitosamente, se genera un token JWT
- La contraseña se almacena hasheada en la base de datos

**Prioridad**: Alta

---

### RF02: Inicio de Sesión
**Descripción**: Los usuarios registrados deben poder autenticarse en el sistema.

**Criterios de Aceptación**:
- El usuario proporciona email y contraseña
- El sistema valida las credenciales
- En caso de éxito, se genera un token JWT válido por 24 horas
- En caso de fallo, se retorna mensaje de error
- El token permite acceder a rutas protegidas

**Prioridad**: Alta

---

### RF03: Gestión de Perfil
**Descripción**: Los usuarios autenticados pueden consultar su información de perfil.

**Criterios de Aceptación**:
- Requiere token JWT válido
- Retorna: nombre, email y fecha de creación
- NO retorna la contraseña
- Si el token es inválido, se rechaza la petición

**Prioridad**: Media

---

### RF04: Crear Producto
**Descripción**: Los usuarios autenticados pueden agregar nuevos productos a su inventario.

**Criterios de Aceptación**:
- Requiere autenticación mediante JWT
- Campos obligatorios: nombre, descripción, precio, stock, categoría
- El precio debe ser mayor o igual a 0
- El stock debe ser mayor o igual a 0
- La categoría debe ser una de las predefinidas
- El producto se asocia automáticamente al usuario autenticado
- Retorna el producto creado con su ID

**Prioridad**: Alta

---

### RF05: Listar Productos
**Descripción**: Los usuarios pueden ver todos sus productos registrados.

**Criterios de Aceptación**:
- Requiere autenticación mediante JWT
- Solo se muestran productos del usuario autenticado
- Retorna array de productos con todos sus datos
- Si no hay productos, retorna array vacío

**Prioridad**: Alta

---

### RF06: Obtener Producto por ID
**Descripción**: Los usuarios pueden consultar el detalle de un producto específico.

**Criterios de Aceptación**:
- Requiere autenticación mediante JWT
- El producto debe existir
- El producto debe pertenecer al usuario autenticado
- Si no existe, retorna error 404
- Si pertenece a otro usuario, retorna error 403
- Retorna todos los datos del producto

**Prioridad**: Media

---

### RF07: Actualizar Producto
**Descripción**: Los usuarios pueden modificar la información de sus productos.

**Criterios de Aceptación**:
- Requiere autenticación mediante JWT
- El producto debe existir y pertenecer al usuario
- Se pueden actualizar: nombre, descripción, precio, stock, categoría
- Las validaciones se aplican a los campos actualizados
- Retorna el producto actualizado
- Si no es propietario, retorna error 403

**Prioridad**: Alta

---

### RF08: Eliminar Producto
**Descripción**: Los usuarios pueden eliminar productos de su inventario.

**Criterios de Aceptación**:
- Requiere autenticación mediante JWT
- El producto debe existir y pertenecer al usuario
- La eliminación es permanente
- Retorna mensaje de confirmación
- Si no es propietario, retorna error 403

**Prioridad**: Alta

---

### RF09: Interfaz Web de Usuario
**Descripción**: Proporcionar una interfaz HTML estática para interactuar con el sistema.

**Criterios de Aceptación**:
- Formularios de registro y login
- Panel de gestión de productos tras autenticación
- Capacidad de crear, editar y eliminar productos desde la UI
- Almacenamiento del token en localStorage
- Cierre de sesión que limpia el token
- Mensajes de error y éxito apropiados

**Prioridad**: Alta

---

## 2. Requerimientos No Funcionales

### RNF01: Tecnología Backend
**Descripción**: La aplicación debe desarrollarse con Node.js y Express.js.

**Justificación**: Son tecnologías modernas, escalables y con amplio soporte de la comunidad.

**Criterio de Cumplimiento**: El código fuente usa Node.js v16+ y Express.js v4.18+

---

### RNF02: Base de Datos
**Descripción**: Uso de MongoDB como sistema de base de datos.

**Justificación**: Base de datos NoSQL flexible, ideal para desarrollo ágil y escalabilidad horizontal.

**Criterio de Cumplimiento**: 
- Conexión mediante Mongoose
- Modelos definidos con schemas
- Validaciones a nivel de base de datos

---

### RNF03: Seguridad de Contraseñas
**Descripción**: Las contraseñas deben almacenarse de forma segura.

**Justificación**: Proteger la información sensible de los usuarios.

**Criterio de Cumplimiento**:
- Uso de bcryptjs con salt rounds >= 10
- Las contraseñas nunca se retornan en las respuestas de la API
- El campo password tiene select: false en el modelo

---

### RNF04: Autenticación JWT
**Descripción**: Implementar autenticación mediante JSON Web Tokens.

**Justificación**: Método stateless, seguro y estándar de la industria.

**Criterio de Cumplimiento**:
- Tokens firmados con clave secreta
- Expiración de 24 horas
- Middleware de validación en rutas protegidas
- Tokens enviados en header Authorization: Bearer <token>

---

### RNF05: Validación de Datos
**Descripción**: Todas las entradas deben validarse.

**Justificación**: Prevenir inyecciones y datos inconsistentes.

**Criterio de Cumplimiento**:
- Validaciones en los modelos de Mongoose
- Validación de tipos de datos
- Mensajes de error descriptivos

---

### RNF06: API RESTful
**Descripción**: La API debe seguir principios REST.

**Justificación**: Estándar de la industria para APIs web.

**Criterio de Cumplimiento**:
- Uso correcto de métodos HTTP (GET, POST, PUT, DELETE)
- Rutas descriptivas y consistentes
- Códigos de estado HTTP apropiados
- Formato JSON para peticiones y respuestas

---

### RNF07: Pruebas Automatizadas
**Descripción**: Cobertura de pruebas >= 80%.

**Justificación**: Garantizar calidad y funcionalidad del código.

**Criterio de Cumplimiento**:
- Pruebas unitarias con Jest
- Pruebas de integración con Supertest
- MongoDB Memory Server para tests aislados
- Ejecución automática en pipeline CI/CD

---

### RNF08: Rendimiento
**Descripción**: Tiempo de respuesta óptimo.

**Expectativa**:
- Endpoints simples (login, registro): < 200ms
- Queries de base de datos: < 300ms
- Carga de interfaz web: < 1s

---

### RNF09: Escalabilidad
**Descripción**: La aplicación debe poder manejar crecimiento de usuarios.

**Estrategia**:
- Arquitectura stateless (JWT)
- Base de datos MongoDB (escalable horizontalmente)
- Código modular y mantenible

---

### RNF10: Deploy y CI/CD
**Descripción**: Despliegue automatizado y continuo.

**Criterio de Cumplimiento**:
- Pipeline de GitHub Actions
- Deploy automático en Vercel
- Ejecución de tests antes del deploy
- Variables de entorno configuradas

---

## 3. Diagrama Entidad-Relación

```
┌─────────────────────┐
│       Usuario       │
├─────────────────────┤
│ _id: ObjectId (PK)  │
│ nombre: String      │
│ email: String       │
│ password: String    │
│ createdAt: Date     │
└─────────────────────┘
          │
          │ 1
          │
          │ tiene
          │
          │ N
          ▼
┌─────────────────────┐
│      Producto       │
├─────────────────────┤
│ _id: ObjectId (PK)  │
│ nombre: String      │
│ descripcion: String │
│ precio: Number      │
│ stock: Number       │
│ categoria: String   │
│ userId: ObjectId(FK)│
│ createdAt: Date     │
└─────────────────────┘
```

**Relaciones**:
- Un Usuario puede tener múltiples Productos (1:N)
- Un Producto pertenece a un único Usuario (N:1)
- La clave foránea userId en Producto referencia a _id en Usuario

---

## 4. Modelo de Datos

### Colección: Users

```javascript
{
  _id: ObjectId,
  nombre: String (required, trim),
  email: String (required, unique, lowercase, match: email regex),
  password: String (required, minlength: 6, select: false),
  createdAt: Date (default: Date.now)
}
```

### Colección: Products

```javascript
{
  _id: ObjectId,
  nombre: String (required, trim),
  descripcion: String (required, trim),
  precio: Number (required, min: 0),
  stock: Number (required, min: 0, default: 0),
  categoria: String (required, enum: ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Deportes', 'Otros']),
  userId: ObjectId (required, ref: 'User'),
  createdAt: Date (default: Date.now)
}
```

---

## 5. Categorías de Productos

El sistema define las siguientes categorías predefinidas:

1. **Electrónica**: Dispositivos electrónicos, computadoras, celulares
2. **Ropa**: Vestimenta, calzado, accesorios
3. **Alimentos**: Productos alimenticios, bebidas
4. **Hogar**: Muebles, decoración, electrodomésticos
5. **Deportes**: Equipamiento deportivo, ropa deportiva
6. **Otros**: Productos que no encajan en categorías anteriores

---

## 6. Flujo de Autenticación

1. **Registro**:
   - Usuario envía datos → Validación → Hash password → Guardar en DB → Generar JWT → Retornar token

2. **Login**:
   - Usuario envía credenciales → Buscar usuario → Comparar password → Generar JWT → Retornar token

3. **Acceso a Recursos Protegidos**:
   - Cliente envía petición con token → Middleware valida token → Buscar usuario → Adjuntar user a request → Continuar a controlador

---

## 7. Manejo de Errores

### Códigos de Estado HTTP Utilizados

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Datos inválidos o faltantes
- **401 Unauthorized**: Token ausente o inválido
- **403 Forbidden**: Usuario no tiene permisos
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

---

## 8. Justificación de la Plataforma SaaS

### Plataforma Elegida: Vercel

**Razones de la elección**:

1. **Integración con Node.js**:
   - Soporte nativo para aplicaciones Node.js
   - Deploy automático desde repositorio GitHub
   - Funciones serverless para endpoints

2. **Facilidad de Uso**:
   - Configuración mínima mediante vercel.json
   - Variables de entorno desde el dashboard
   - Deploys automáticos en cada push

3. **Performance**:
   - CDN global para baja latencia
   - Compresión automática
   - HTTPS por defecto

4. **CI/CD Integrado**:
   - Preview deployments para cada PR
   - Rollback instantáneo
   - Logs en tiempo real

5. **Plan Gratuito Generoso**:
   - Suficiente para desarrollo y pruebas
   - Sin necesidad de tarjeta de crédito inicial

**Alternativas Consideradas**:
- **Heroku**: Requiere tarjeta de crédito, menos intuitivo
- **Railway**: Buena opción pero menos documentación
- **Render**: Similar a Vercel pero menor velocidad de deploy

**Conclusión**: 
Vercel ofrece el mejor balance entre facilidad de uso, performance y costo para este proyecto educativo.

---

## 9. Arquitectura del Sistema

```
┌─────────────────┐
│   Cliente Web   │
│  (HTML/JS/CSS)  │
└────────┬────────┘
         │
         │ HTTP/HTTPS
         │
         ▼
┌─────────────────┐
│   Express.js    │
│   (API REST)    │
├─────────────────┤
│  - Middlewares  │
│  - Rutas        │
│  - Controladores│
└────────┬────────┘
         │
         │ Mongoose
         │
         ▼
┌─────────────────┐
│    MongoDB      │
│  (Atlas/Local)  │
├─────────────────┤
│  - Users        │
│  - Products     │
└─────────────────┘
```

---

## 10. Seguridad Implementada

1. **Autenticación**:
   - JWT con expiración
   - Tokens en headers, no en URL

2. **Autorización**:
   - Middleware protect en rutas sensibles
   - Validación de pertenencia de recursos

3. **Datos**:
   - Hashing de passwords con bcrypt
   - Validación de entrada
   - Sanitización contra NoSQL injection

4. **Comunicación**:
   - HTTPS en producción (Vercel)
   - CORS configurado

---

## 11. Mejoras Futuras

1. Refresh tokens para sesiones prolongadas
2. Roles de usuario (Admin, Usuario)
3. Paginación en listado de productos
4. Búsqueda y filtros avanzados
5. Imágenes de productos
6. Historial de cambios
7. Notificaciones por email
8. Rate limiting para prevenir abuso
9. Documentación con Swagger
10. Métricas y monitoring

---

**Fecha de Creación**: Febrero 2026  
**Versión**: 1.0
