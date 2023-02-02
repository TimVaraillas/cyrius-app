import { User } from '~/types/user'

export interface Org {
  id: string, 
  name: string,
  labels: string[],
  users: User[],
}