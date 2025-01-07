import axios, { AxiosError, HttpStatusCode } from 'axios'
import { config } from '../constants/config.ts'

 
// @ts-expect-error
export function isAxiosError(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}


 
// @ts-expect-error
export function isAxiosUnprocessableEntity(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status == HttpStatusCode.UnprocessableEntity
}



export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE').format(value)
}

export function formatNumberToSocialStyle(value: number): string {
  return new Intl.NumberFormat('en',{
    notation: 'compact',
    maximumFractionDigits: 1
  })?.format(value).replace('.', ',')?.toLowerCase()
}

export function rundomNumber(old_price: number, new_price: number): string {
  return ((old_price - new_price) / old_price * 100).toFixed()
}

export function formatRating(rating: number): string {
  if (rating > 0) {
    return rating.toFixed(1);
  }
  return '1'
}
/**
 * A utility type that recursively removes `undefined` from all fields of a given type `T`.
 *
 * This type ensures that none of the fields in the resulting type can be `undefined`.
 *
 * @template T - The type from which `undefined` should be removed.
 * @example
 * type Example = { a: number | undefined, b: { c: string | undefined } };
 * type Result = NoUndefinedField<Example>;
 * // Result is { a: number, b: { c: string } }
 */
export type NoUndefinedField<T> = { [K in keyof T]-?: NoUndefinedField<NonNullable<T[K]>> }

export const getAvatar = (url?: string) => {
  return url ? `${config.BASE_URL}images/${url}` : 'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0='
}
