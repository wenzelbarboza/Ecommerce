export type NewUserRequestBody = {
  id: string;
  name: string;
  email: string;
  photo: string;
  // role: "USER" | "ADMIN";
  // gender: "MALE" | "FEMALE";
  role: Role;
  gender: Gender;
  dob: Date;
};

enum Role {
  // "USER",
  // "ADMIN",
  USER = "USER",
  ADMIN = "ADMIN",
}

enum Gender {
  // "MALE",
  // "FEMALE",
  MALE = "MALE",
  FEMALE = "FEMALE",
}
