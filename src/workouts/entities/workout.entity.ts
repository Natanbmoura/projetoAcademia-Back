import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  PrimaryGeneratedColumn 
} from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { Instructor } from '../../instructors/entities/instructor.entity';

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memberId' })
  member: Member;


  @ManyToOne(() => Instructor, { nullable: false })
  @JoinColumn({ name: 'instructorId' })
  instructor: Instructor;

  @CreateDateColumn()
  createdAt: Date;
}