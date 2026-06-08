
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
  password_hash: string;


  @Column({ type: 'integer' })
  experience_years: number;


  @Column({ type: 'text' })
  qualification: string;


  @Column({ type: 'varchar' })
  specialization: string;

  @Column({ type: 'integer' })
  consultation_fee: number;

  
  @Column({ type: 'varchar' })
  phone: string;


  @Column({ type: 'varchar' })
  gender: string;
  
  @Column({ type: 'text' })
  bio: string;
  
  @Column({type:'varchar'})
  clinic_name:string;

  @Column({type:'varchar'})
  clinic_address:string;
  
  @Column({type:'boolean'})
  is_profile_completed:boolean;


}