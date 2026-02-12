// Script para limpiar productos huérfanos (sin userId)
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');

const cleanDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Eliminar productos sin userId
    const result = await Product.deleteMany({ 
      $or: [
        { userId: { $exists: false } },
        { userId: null }
      ]
    });

    console.log(`✅ Eliminados ${result.deletedCount} productos huérfanos`);

    // Mostrar productos restantes por usuario
    const products = await Product.aggregate([
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📊 Productos por usuario:');
    products.forEach(p => {
      console.log(`  Usuario ${p._id}: ${p.count} productos`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Limpieza completada');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanDatabase();
