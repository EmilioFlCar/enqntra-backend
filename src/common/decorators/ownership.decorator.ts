import { SetMetadata } from "@nestjs/common";

export const OWNERSHIP_KEY = 'ownership';

export const Ownership = (resource: 'service' | 'business' | 'appointment') =>
  SetMetadata(OWNERSHIP_KEY, resource);