import bcrypt from 'bcrypt'

const saltRounds = 5; 

// Function to hash the password
export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error(error);
    throw new Error('Error hashing the password');
  }
};

export const verifyPassword = async (enteredPassword, storedHashedPassword) => {
    try {
      const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
      return isMatch;
    } catch (error) {
      console.error(error);
      throw new Error('Error verifying the password');
    }
  };
  