import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany, 
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Member } from '../../members/entities/member.entity';
import { Workout } from '../../workouts/entities/workout.entity';

@Entity('instructors')
@Unique(['email'])
@Unique(['cpf'])
export class Instructor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  cpf: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  
  @Column({ nullable: true })
  emergencyPhone: string; 

  @Column({ default: 'light' })
  theme: string; 
  

  @OneToMany(() => Member, (member) => member.createdByInstructor)
  members: Member[];


  @OneToMany(() => Workout, (workout) => workout.instructor)
  workouts: Workout[];

  @CreateDateColumn()
  createdAt: Date;
}