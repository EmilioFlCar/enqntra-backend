import { Role } from "prisma/generated/enums";

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}