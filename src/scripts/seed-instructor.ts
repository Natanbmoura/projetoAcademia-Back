import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { InstructorsService } from '../instructors/instructors.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const instructorsService = app.get(InstructorsService);

  try {
    // Verificar se já existe um instrutor com esse email
    const existing = await instructorsService.findByEmail('professor@academia.com');
    
    if (existing) {
      console.log('✅ Instrutor de teste já existe');
      await app.close();
      return;
    }

    // Criar instrutor de teste
    await instructorsService.create({
      name: 'Professor Teste',
      email: 'professor@academia.com',
      cpf: '12345678900',
      password: 'senha123',
    });

    console.log('✅ Instrutor de teste criado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar instrutor de teste');
  } finally {
    await app.close();
  }
}

seed();






















