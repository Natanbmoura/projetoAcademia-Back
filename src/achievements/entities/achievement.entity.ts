import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Member } from '../../members/entities/member.entity';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  points: number;

  @Column({ nullable: true })
  iconUrl: string;

  
  @ManyToMany(() => Member)
  @JoinTable({ name: 'member_achievements' }) 
  members: Member[];
}