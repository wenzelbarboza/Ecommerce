export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role?: string;
  dob: string;
  id: string;
};

export type userResponseType = {
  success: boolean;
  data: User;
};
