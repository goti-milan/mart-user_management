import {
  Model,
  Column,
  Table,
  DataType,
  PrimaryKey,
  Default,
  Unique,
  AllowNull,
  Index,
} from 'sequelize-typescript';

// Enum for User Roles
export enum UserRole {
  ADMIN = 'admin',
  MANUFACTURE = 'manufacture',
  RETAILER = 'retailer',
}

@Table({
  tableName: 'users',
  timestamps: true, // Adds 'createdAt' & 'updatedAt'
  underscored: true, // Use snake_case columns for better SQL conventions
  paranoid: true, // Adds 'deletedAt' for soft deletes
})
export class User extends Model<User> {
  // Primary Key with UUID v4
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  // First Name
  @AllowNull(false)
  @Column(DataType.STRING)
  firstName!: string;

  // Last Name
  @AllowNull(false)
  @Column(DataType.STRING)
  lastName!: string;

  // Email with unique constraint and index
  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING)
  email!: string;

  // Password
  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  // User Role with Enum
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(UserRole)))
  role!: UserRole;

  // Phone Number (optional)
  @AllowNull(true)
  @Unique
  @Column(DataType.STRING)
  phoneNumber?: string;

  // Email Verified Flag
  @AllowNull(false)
  @Default(false) // Ensures a default value if not provided
  @Column(DataType.BOOLEAN)
  isEmailVerified!: boolean;

  // Phone Verified Flag
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isPhoneVerified!: boolean;

  // Active Status Flag
  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive!: boolean;

  // Refresh Token (optional)
  @Column(DataType.STRING)
  refreshToken?: string;
}
