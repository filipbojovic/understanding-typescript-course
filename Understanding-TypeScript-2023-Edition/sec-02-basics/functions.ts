function add(n1: number, n2: number): number {
  return n1 + n2;
}

// void return type which is not present in JavaScript
function printResult(num: number): void {
  console.log("Result: " + num);
}

function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
  const result = n1 + n2;
  cb(result);
}

addAndHandle(10, 20, (result) => {
  console.log(result);
});

printResult(add(5, 12));

// 1. the 'Function' type is provided by the TypeScript and it tells us
// that whatever we provide to combineValues it has to be a function.
// 2. it would be good if we could somehow specify how the function should look like so we
// don't allow combineValues to points to 'printResult' e.g.
// let combineValues: Function;
// 3. here we specified that combineValues must point to a function which returns 'number'
// and which accepts two values, both numbers
let combineValues: (a: number, b: number) => number;

combineValues = add;
// once introduced p3. this is not possible
// combineValues = printResult;

console.log(combineValues(8, 8));
