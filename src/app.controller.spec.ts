export class Doctor {}
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('doctors')
export class Doctor {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  specialization: string;

  @Column({ type: 'varchar' })
  password_hash: string;

  @Column({type:'boolean'})
  is_profile_completed:boolean
}