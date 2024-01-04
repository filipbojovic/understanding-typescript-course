// const names: Array<string> = [];

// const promise: Promise<string> = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("This is done!");
//   }, 2000);
// });

// promise.then((data) => {
//   data.split("");
// });

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: "Fika", hobbies: ["Sports"] }, { age: 25 });
console.log(mergedObj);

interface Lengthy {
  length: number;
}

function countAndPDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = "Got no value";
  if (element.length > 0) {
    descriptionText = "Got " + element.length + " elements";
  }
  return [element, descriptionText];
}

console.log(countAndPDescribe("Hi there!"));

// 98 the KeyOf constraint
function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return "Value: " + obj[key];
}
console.log(extractAndConvert({ name: "Fika" }, "name"));

// 99 GENERIC CLASSES
class DataStorage<T > {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item) {
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}
