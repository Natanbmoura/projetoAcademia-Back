import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstructorsModule } from './instructors/instructors.module';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { AnamnesesModule } from './anamneses/anamneses.module';
import { ExercisesModule } from './exercises/exercises.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { WorkoutItemsModule } from './workout-items/workout-items.module';
// --- NOVOS IMPORTS ADICIONADOS ---
import { WorkoutHistoryModule } from './workout-history/workout-history.module';
import { AchievementsModule } from './achievements/achievements.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // Suporta DATABASE_URL (formato do Neon) ou variáveis individuais
        const databaseUrl = config.get<string>('DATABASE_URL');
        
        if (databaseUrl) {
          // Parse da URL de conexão do PostgreSQL
          const url = new URL(databaseUrl);
          return {
            type: 'postgres',
            host: url.hostname,
            port: parseInt(url.port) || 5432,
            username: url.username,
            password: url.password,
            database: url.pathname.slice(1), // Remove a barra inicial
            ssl: {
              rejectUnauthorized: false, // Necessário para Neon
            },
            autoLoadEntities: true,
            synchronize: config.get<string>('DB_SYNC', 'false') === 'true',
          };
        }
        
        // Fallback para variáveis individuais
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST', 'localhost'),
          port: config.get<number>('DB_PORT', 5432),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASS'),
          database: config.get<string>('DB_NAME'),
          ssl: config.get<string>('DB_SSL') === 'true' ? {
            rejectUnauthorized: false,
          } : false,
          autoLoadEntities: true,
          synchronize: config.get<string>('DB_SYNC', 'false') === 'true',
        };
      },
    }),
    InstructorsModule,
    AuthModule,
    MembersModule,
    AnamnesesModule,
    ExercisesModule,
    WorkoutsModule,
    WorkoutItemsModule,
    WorkoutHistoryModule,
    AchievementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}