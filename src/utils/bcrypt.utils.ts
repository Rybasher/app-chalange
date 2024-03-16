import * as bcrypt from 'bcryptjs'

export function encodePassword(password: string): string {
  return bcrypt.hashSync(password, 5)
}

export function comparePassword(
  password: string,
  hashedPassword: string
): boolean {
  return bcrypt.compareSync(password, hashedPassword)
}
