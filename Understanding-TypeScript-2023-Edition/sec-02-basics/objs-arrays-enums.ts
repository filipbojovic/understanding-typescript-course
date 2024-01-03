// const person: {
//   name: string;
// } = {

// const person: {
//   name: string;
//   age: number;
//   hobbies: string[];
//   role: [number, string];
// } = {
//   name: "Filip",
//   age: 25,
//   hobbies: ["Sports", "Cooking"],
//   // typescript doesn't know that role should be a tupple, so we can push whatever to this array.
//   // but after defining that this is a tupple, that won't be possible.
//   role: [2, "author"],
// };

enum Role {
  ADMIN,
  READ_ONLY,
  AUTHOR,
}

const person = {
  name: "Filip",
  age: 25,
  hobbies: ["Sports", "Cooking"],
  role: Role.ADMIN,
};

let favoriteActivities: string[];
for (const hobby of person.hobbies) {
  console.log(hobby.toUpperCase());
}

console.log(person);
