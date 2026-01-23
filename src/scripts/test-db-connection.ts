import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Carrega o .env
config({ path: path.join(__dirname, '../../.env') });

async function testConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL não encontrada no .env');
    process.exit(1);
  }

  console.log('🔍 Testando conexão com o banco de dados...\n');

  try {
    // Parse da URL
    const url = new URL(databaseUrl);
    console.log(`📍 Host: ${url.hostname}`);
    console.log(`📍 Port: ${url.port || 5432}`);
    console.log(`📍 Database: ${url.pathname.slice(1)}`);
    console.log(`📍 User: ${url.username}\n`);

    const dataSource = new DataSource({
      type: 'postgres',
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeoutMS: 10000, // 10 segundos
    });

    console.log('⏳ Tentando conectar...');
    await dataSource.initialize();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testa uma query simples
    const result = await dataSource.query('SELECT NOW() as current_time');
    console.log(`✅ Query de teste executada: ${result[0].current_time}`);
    
    await dataSource.destroy();
    console.log('\n✅ Teste concluído com sucesso!');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro ao conectar:', error.message);
    
    if (error.code === 'ETIMEDOUT') {
      console.error('\n💡 Possíveis causas:');
      console.error('  1. O banco Neon pode estar offline ou a conexão expirou');
      console.error('  2. Verifique se a URL de conexão está atualizada no console do Neon');
      console.error('  3. Problemas de rede/firewall bloqueando a conexão');
      console.error('  4. A URL pode estar incorreta ou malformada');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Host não encontrado. Verifique se a URL está correta.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Conexão recusada. Verifique se o banco está rodando.');
    }
    
    console.error('\n📋 Detalhes do erro:', error);
    process.exit(1);
  }
}

testConnection();

