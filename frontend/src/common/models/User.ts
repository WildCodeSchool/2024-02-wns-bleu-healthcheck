export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
}

enum Role {
  USER,
  PREMIUM,
  ADMIN
}
  