import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne, // <--- ADICIONADO: Import do OneToOne
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Instructor } from '../../instructors/entities/instructor.entity';
// ADICIONADO: Import da entidade Anamnesis (confira se o nome do arquivo lá na pasta está 'anamnesis.entity.ts' no singular)
import { Anamnesis } from '../../anamneses/entities/anamnesis.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  emergencyPhone: string;

  @Column()
  emergencyEmail: string;

  @ManyToOne(() => Instructor, { nullable: false })
  @JoinColumn({ name: 'createdByInstructorId' })
  createdByInstructor: Instructor;

  // --- ADICIONADO: O Relacionamento com a Anamnesis ---
  @OneToOne(() => Anamnesis, (anamnesis) => anamnesis.member)
  anamnesis: Anamnesis;
  // ----------------------------------------------------

  @CreateDateColumn()
  createdAt: Date;
}