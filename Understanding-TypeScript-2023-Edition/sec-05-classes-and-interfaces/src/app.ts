// type AddFn = (a: number, b: number) => number;
// use the interface as a function type
interface AddFn {
  (a: number, b: number): number;
}

let addFn: AddFn;
addFn = (n1: number, n2: number) => {
  return n1 + n2;
};


interface Named {
  readonly name: string;
  // '?' tells TypeScript that isn't mandatory for this property to exists in the class
  outputName?: string;
}

interface Greetable extends Named {
  greet(phrase: string): void;
}

class Person implements Greetable {
  constructor(public name: string, public age: number) {}

  greet(phrase: string): void {
    console.log(phrase + " " + this.name + " " + this.age);
  }
}

// typecheck an object
let user1 = new Person("Fika", 25);

user1.greet("Hi there, I am");
