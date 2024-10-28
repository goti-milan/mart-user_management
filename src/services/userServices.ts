import { User } from "../models/user";
import { UserData } from "../utils/interface";
import { ValidationError, UniqueConstraintError } from "sequelize";

// Improved typing for whereQuery using Partial<UserData>
export const findUser = async (whereQuery: Partial<UserData>): Promise<any> => {
  try {
    const user = await User.findOne({ where: whereQuery });
    return user?.dataValues;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
    throw new Error(`Unexpected error: ${String(error)}`);
  }
};

export const createUser = async (userData : any): Promise<User> => {
  try {
    const user = await User.create(userData);
    return user?.dataValues;

  } catch (error: unknown) {
    if (error instanceof UniqueConstraintError) {
      throw new Error(`Duplicate entry: ${error.message}`);
    } else if (error instanceof ValidationError) {
      throw new Error(`Validation error: ${error.message}`);
    } else if (error instanceof Error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
    throw new Error(`Unexpected error: ${String(error)}`);
  }
};

export const updateUser = async (updateQuery: any, updateCondition: any): Promise<User | null> => {
  try {
    // Update the user record based on the condition
    const [affectedRows, [updatedUser]] = await User.update(updateQuery, {
      where: updateCondition, // Condition to find the correct user(s)
      returning: true, // Ensures the updated row is returned
    });

    if (affectedRows === 0) {
      throw new Error('User not found or no changes made');
    }

    return updatedUser?.dataValues || null; // Return the updated user data or null if not found
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
    throw new Error(`Unexpected error: ${String(error)}`);
  }
};