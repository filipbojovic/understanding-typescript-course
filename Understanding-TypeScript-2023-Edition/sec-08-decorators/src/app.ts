function Logger(logString: string) {
  console.log("Running Logger factory");
  return function (constructor: Function) {
    console.log("Rendering Logger decorator");

    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log("Running WithTemplate factory");

  // 112
  return function <T extends { new (...args: any[]): { name: string } }>(
    originalconstructor: T
  ) {
    // returning constructor function which is based on given constructor
    return class extends originalconstructor {
      constructor(...args: any[]) {
        super();

        console.log("Rendering WithTemplate decorator");

        const hookel = document.getElementById(hookId);
        if (hookel) {
          hookel.innerHTML = template;
          hookel.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
}

// Factories of decorators are being executed in the top-down direction, while the actual decorator
// functions are being executed in the bottom-up direction.
@Logger("LOGGING")
@WithTemplate("<h1>My Person Object</h1>", "app")
class Person {
  name = "Max";

  constructor() {
    console.log("Creating person object...");
  }
}

const person = new Person();
console.log(person);

// 109 property decorators
// target of the property
function Log(target: any, propertyName: string) {
  console.log("Property decorator");
  console.log(target, propertyName);
}

// target is either a prototype of a class if we are dealing with an instance
// or it will be a constructor function if we are dealing with a static one
// decorator for accessors
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("Accessor decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("Method decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// name is not the name of the parameter, but the name of the method which uses this parameter
// position is the pos of this argument in the method args
function Log4(target: any, name: string | Symbol, position: number) {
  console.log("Argument decorator!");
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("Invalid price - should be positive!");
    }
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

const p1 = new Product("Book 1", 19);
const p2 = new Product("Book 1", 29);

// 114 autobind decorator
function Autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  // reach the method
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      // here we define some extra work to do when the method is called
      // 'this' reffers to anything which is responsible for triggering this 'get' method.
      // 'get' method will be triggered by the concrete object to whom it belongs to
      // this is done instead of adding '.bind(p)' to 'button.addEventListener("click", p.showMessage)'
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class Printer {
  message = "This works!";

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();
const button = document.querySelector("button")!;
button.addEventListener("click", p.showMessage);

// 115 decorators for validation

interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[]; // ['required', 'positive']
  };
}

const registeredValidators: ValidatorConfig = {};

// own decorator for validation
function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ["required"],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ["positive"],
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name]; // here 'Course' would be extracted

  if (!objValidatorConfig) {
    // if we didn't find validation configuration for this class, then we consider it as verified
    return true;
  }

  let isValid = true;
  for (const prop in objValidatorConfig) {
    // property names
    for (const validator of objValidatorConfig[prop]) {
      // iterate validator properties (positive, required, etc.)
      switch (validator) {
        case "required":
          isValid = isValid && !!obj[prop]; // to convert it to true/false we use one more '!'
          break;
        case "positive":
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;

  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector("form")!;
courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const titleEl = document.getElementById("title") as HTMLInputElement;
  const priceEl = document.getElementById("price") as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCoures = new Course(title, price);

  if (!validate(createdCoures)) {
    alert("Invalid input, please try again!");
    return;
  }
  console.log(createdCoures);
});
