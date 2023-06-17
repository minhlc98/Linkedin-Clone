export interface ISignIn {
  error: boolean;
  message: string | null;
  user: Object | null;
  token: string | null
}