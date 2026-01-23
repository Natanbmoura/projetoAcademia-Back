import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { Achievement } from './achievement.entity';

@Entity('member_achievements')
export class MemberAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memberId' })
  member: Member;

  @ManyToOne(() => Achievement, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'achievementId' })
  achievement: Achievement;

  @CreateDateColumn()
  unlockedAt: Date;
}









