# API de Gestión de Productos

Sistema de gestión de productos con autenticación JWT desarrollado con Node.js, Express.js y MongoDB.

## Características

- ✅ Sistema de autenticación con JWT
- ✅ CRUD completo de productos
- ✅ Protección de rutas con middleware
- ✅ Validación de datos
- ✅ Pruebas unitarias con Jest
- ✅ Interfaz web estática para login y gestión
- ✅ CI/CD con GitHub Actions
- ✅ Deploy en Vercel

## Tecnologías

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- Jest & Supertest
- MongoDB Memory Server

## Requisitos Previos

- Node.js v16 o superior
- MongoDB instalado localmente o cuenta en MongoDB Atlas
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd Actividad_4
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` en la raíz del proyecto:
```bash
cp .env.example .env
```

4. Configurar variables de entorno en `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gestion_productos
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRE=24h
NODE_ENV=development
```

Para producción (Vercel), usar MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/gestion_productos
```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Pruebas
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch
```

## Endpoints de la API

### Autenticación

**Registro**
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Perfil (requiere autenticación)**
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Productos (todas las rutas requieren autenticación)

**Obtener todos los productos**
```http
GET /api/products
Authorization: Bearer <token>
```

**Obtener un producto**
```http
GET /api/products/:id
Authorization: Bearer <token>
```

**Crear producto**
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Laptop HP",
  "descripcion": "Laptop 15 pulgadas",
  "precio": 799.99,
  "stock": 10,
  "categoria": "Electrónica"
}
```

**Actualizar producto**
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Laptop HP Gaming",
  "precio": 1299.99
}
```

**Eliminar producto**
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

## Categorías Válidas

- Electrónica
- Ropa
- Alimentos
- Hogar
- Deportes
- Otros

## Interfaz Web

La aplicación incluye una interfaz web estática en `/public/index.html` que permite:

- Registro de usuarios
- Login
- Panel de gestión de productos
- CRUD completo desde la interfaz

Acceder a: `http://localhost:3000`

## Estructura del Proyecto

```
Actividad_4/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── productController.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   └── index.js
├── public/
│   └── index.html
├── tests/
│   ├── authController.test.js
│   └── productController.test.js
├── docs/
│   └── Documentacion.md
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Deploy en Vercel

### Preparación

1. Crear cuenta en MongoDB Atlas y obtener URI de conexión
2. Crear cuenta en Vercel
3. Conectar repositorio de GitHub a Vercel

### Variables de Entorno en Vercel

Configurar en el dashboard de Vercel:
- `MONGODB_URI`: URI de MongoDB Atlas
- `JWT_SECRET`: Clave secreta para JWT
- `JWT_EXPIRE`: Tiempo de expiración del token (ej: 24h)
- `NODE_ENV`: production

### Archivo vercel.json

El archivo `vercel.json` ya está configurado para el deploy.

## CI/CD con GitHub Actions

El pipeline de CI/CD se ejecuta automáticamente en cada push y:

1. Ejecuta las pruebas unitarias
2. Verifica la cobertura de código
3. Despliega a Vercel si las pruebas pasan

Ver `.github/workflows/ci-cd.yml` para más detalles.

## Pruebas

Las pruebas incluyen:

### Auth Controller
- ✅ Registro de usuarios
- ✅ Login con credenciales válidas/inválidas
- ✅ Obtención de perfil con/sin token
- ✅ Validación de tokens JWT

### Product Controller
- ✅ Creación de productos
- ✅ Listado de productos
- ✅ Obtención de producto por ID
- ✅ Actualización de productos
- ✅ Eliminación de productos
- ✅ Validación de permisos (usuarios solo pueden modificar sus productos)

Cobertura de código: >80%

## Seguridad

- Passwords hasheados con bcrypt
- Autenticación mediante JWT
- Validación de datos de entrada
- Protección de rutas sensibles
- Usuarios solo pueden acceder a sus propios productos

## Autor

Proyecto desarrollado para la asignatura de Desarrollo Web

## Licencia

ISC
