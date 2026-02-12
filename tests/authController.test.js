const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../src/models/User');

let mongoServer;
let app;

beforeAll(async () => {
  // Desconectar de MongoDB Atlas si está conectado
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  // Crear MongoDB en memoria para tests
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // Cargar la app después de configurar la DB
  process.env.NODE_ENV = 'test';
  const appModule = require('../src/index');
  app = appModule.app;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('debería registrar un nuevo usuario', async () => {
      const userData = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.nombre).toBe(userData.nombre);
    });

    it('no debería registrar usuario con email duplicado', async () => {
      const userData = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await request(app).post('/api/auth/register').send(userData);
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('El usuario ya existe');
    });

    it('debería validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('debería hacer login con credenciales correctas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe('test@example.com');
    });

    it('no debería hacer login con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Email o contraseña incorrectos');
    });

    it('no debería hacer login con email no existente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexiste@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.message).toBe('Email o contraseña incorrectos');
    });
  });

  describe('GET /api/auth/profile', () => {
    let token;

    beforeEach(async () => {
      const response = await request(app).post('/api/auth/register').send({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      token = response.body.token;
    });

    it('debería obtener perfil con token válido', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.email).toBe('test@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('no debería obtener perfil sin token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.message).toBe('No autorizado, no hay token');
    });

    it('no debería obtener perfil con token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer tokeninvalido')
        .expect(401);

      expect(response.body.message).toBe('No autorizado, token inválido');
    });
  });
});
