const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Product = require('../src/models/Product');

let mongoServer;
let token;
let userId;
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

beforeEach(async () => {
  const response = await request(app).post('/api/auth/register').send({
    nombre: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });
  token = response.body.token;
  userId = response.body._id;
});

afterEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
});

describe('Product Controller', () => {
  describe('POST /api/products', () => {
    it('debería crear un nuevo producto', async () => {
      const productData = {
        nombre: 'Laptop',
        descripcion: 'Laptop HP 15"',
        precio: 799.99,
        stock: 10,
        categoria: 'Electrónica'
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData)
        .expect(201);

      expect(response.body.nombre).toBe(productData.nombre);
      expect(response.body.precio).toBe(productData.precio);
      expect(response.body).toHaveProperty('_id');
    });

    it('no debería crear producto sin autenticación', async () => {
      const productData = {
        nombre: 'Laptop',
        descripcion: 'Laptop HP 15"',
        precio: 799.99,
        stock: 10,
        categoria: 'Electrónica'
      };

      await request(app)
        .post('/api/products')
        .send(productData)
        .expect(401);
    });

    it('debería validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ nombre: 'Laptop' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('no debería crear producto con precio negativo', async () => {
      const productData = {
        nombre: 'Laptop',
        descripcion: 'Laptop HP 15"',
        precio: -100,
        stock: 10,
        categoria: 'Electrónica'
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await Product.create([
        {
          nombre: 'Laptop',
          descripcion: 'Laptop HP',
          precio: 799.99,
          stock: 10,
          categoria: 'Electrónica',
          userId: userId
        },
        {
          nombre: 'Mouse',
          descripcion: 'Mouse inalámbrico',
          precio: 29.99,
          stock: 50,
          categoria: 'Electrónica',
          userId: userId
        }
      ]);
    });

    it('debería obtener todos los productos del usuario', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('no debería obtener productos sin autenticación', async () => {
      await request(app)
        .get('/api/products')
        .expect(401);
    });
  });

  describe('GET /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        nombre: 'Laptop',
        descripcion: 'Laptop HP',
        precio: 799.99,
        stock: 10,
        categoria: 'Electrónica',
        userId: userId
      });
      productId = product._id;
    });

    it('debería obtener un producto por ID', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.nombre).toBe('Laptop');
      expect(response.body._id).toBe(productId.toString());
    });

    it('debería retornar 404 para producto no existente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.message).toBe('Producto no encontrado');
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        nombre: 'Laptop',
        descripcion: 'Laptop HP',
        precio: 799.99,
        stock: 10,
        categoria: 'Electrónica',
        userId: userId
      });
      productId = product._id;
    });

    it('debería actualizar un producto', async () => {
      const updateData = {
        nombre: 'Laptop Gaming',
        precio: 1299.99
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.nombre).toBe(updateData.nombre);
      expect(response.body.precio).toBe(updateData.precio);
    });

    it('no debería actualizar producto de otro usuario', async () => {
      // Crear otro usuario
      const otherUserResponse = await request(app).post('/api/auth/register').send({
        nombre: 'Other User',
        email: 'other@example.com',
        password: 'password123'
      });
      const otherToken = otherUserResponse.body.token;

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ nombre: 'Hacked' })
        .expect(403);

      expect(response.body.message).toBe('No autorizado');
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        nombre: 'Laptop',
        descripcion: 'Laptop HP',
        precio: 799.99,
        stock: 10,
        categoria: 'Electrónica',
        userId: userId
      });
      productId = product._id;
    });

    it('debería eliminar un producto', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('Producto eliminado');

      const deletedProduct = await Product.findById(productId);
      expect(deletedProduct).toBeNull();
    });

    it('no debería eliminar producto de otro usuario', async () => {
      const otherUserResponse = await request(app).post('/api/auth/register').send({
        nombre: 'Other User',
        email: 'other@example.com',
        password: 'password123'
      });
      const otherToken = otherUserResponse.body.token;

      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.message).toBe('No autorizado');
    });
  });
});
