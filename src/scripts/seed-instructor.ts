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
      console.log('✅ Instrutor de teste já existe:');
      console.log(`   Email: ${existing.email}`);
      console.log(`   ID: ${existing.id}`);
      console.log(`   Nome: ${existing.name}`);
      await app.close();
      return;
    }

    // Criar instrutor de teste
    const instructor = await instructorsService.create({
      name: 'Professor Teste',
      email: 'professor@academia.com',
      cpf: '12345678900',
      password: 'senha123',
    });

    console.log('✅ Instrutor de teste criado com sucesso!');
    console.log(`   ID: ${instructor.id}`);
    console.log(`   Nome: ${instructor.name}`);
    console.log(`   Email: ${instructor.email}`);
    console.log(`   CPF: ${instructor.cpf}`);
    console.log('\n📝 Credenciais para login:');
    console.log(`   Email: professor@academia.com`);
    console.log(`   Senha: senha123`);
  } catch (error) {
    console.error('❌ Erro ao criar instrutor de teste:', error);
  } finally {
    await app.close();
  }
}

seed();



