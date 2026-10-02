export type User = {
  id_user: number;
  first_name: string;
  last_name: string;
  email: string;
};

export type Credentials = { email: string; password: string };

export type RegisterInput = Credentials & {
  first_name: string;
  last_name: string;
};
