import { NotFoundException } from '~/utils/exceptions'

export const NotFoundHandler = () => {
  throw new NotFoundException(`Resource not found`)
}