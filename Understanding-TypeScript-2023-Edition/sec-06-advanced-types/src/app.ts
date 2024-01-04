// type Admin = {
interface Admin {
  name: string;
  privileges: string[];
}

// type Employee = {
interface Employee {
  name: string;
  startDate: Date;
}

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "Fika",
  privileges: ["create-server"],
  startDate: new Date(),
};

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

function add(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}

type UnkonwnEmployee = Employee | Admin;
function printEmployeeInformation(emp: UnkonwnEmployee) {
  console.log("Name " + emp.name);
  if ("privileges" in emp) {
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("Start date: " + emp.startDate);
  }
}
printEmployeeInformation({
  name: "Fika",
  privileges: [],
  startDate: new Date(),
});

class Car {
  drive() {
    console.log("Driving...");
  }
}
class Truck {
  drive() {
    console.log("Driving a truck...");
  }

  loadCargo(amount: number) {
    console.log("Loading cargo..." + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(5);
  }
}
useVehicle(v2);

// DISCRIMINATED UNIONS 85
interface Bird {
  type: "bird"; // not a value for 'type' property, but this is a literal type
  flyingSpeed: number;
}

interface Horse {
  type: "horse";
  runningSpeed: number;
}

type Animal = Bird | Horse;
function moveAnimal(animal: Animal) {
  let speed: number;
  switch (animal.type) {
    case "bird":
      speed = animal.flyingSpeed;
      break;
    case "horse":
      speed = animal.runningSpeed;
      break;

    default:
      speed = 10;
      break;
  }
  console.log("Moving with speed: " + speed);
}

moveAnimal({ type: "bird", flyingSpeed: 15 });

// TYPE CASTING 86
// typescript doesn't know what is the exact type of userInputElement, but only that it's an HTMLElement
// so we need to do type casting 1.
// const userInputElement = <HTMLInputElement>(
//   document.getElementById("user-input")!
// );
// in order to not clash with a React JSX syntax, type script provided another way for casting
const userInputElement = document.getElementById(
  "user-input"
)! as HTMLInputElement;

userInputElement.value = "Hi there!";

// INDEX PROPERTIES 87
interface ErrorContainer {
  // there will be properties whose type is string, and whose name is specified as string.
  // the number of properties is unkonwn.
  [prop: string]: string;

  // We can add  predefined properties but only if they are of the same type as prop.
  //   id: string;
}
const errorBag: ErrorContainer = {
  email: "Not a valid email!",
  username: "Missing one character!",
};

// 89 Optional Chaining
const fetchedUserData = {
  id: "id1",
  name: "Fika",
  job: { title: "SWE", description: "BE" },
};

// this would avoid errors in JavaScript
// console.log(fetchedUserData.job && fetchedUserData.job.title);
// with typescript
console.log(fetchedUserData?.job?.title);

// 90 Nullish Coalescing
const userInput = "";
const storedData = userInput || "DEFAULT";

// the output will be 'default' because the empty string is considered as 'false'.
console.log(storedData);

// if we want to check whether a var is NULL or UNDEFINED, then the '??' nullish coalescing operator should
// be used
const storedData2 = userInput ?? "DEFAULT";
console.log(storedData2);