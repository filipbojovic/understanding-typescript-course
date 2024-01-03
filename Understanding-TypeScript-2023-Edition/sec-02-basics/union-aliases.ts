// defining alias
type Combinable = number | string;
type ConversionDescriptor = "as-number" | "as-text";

// by using a union type, we can specify what types we expect as args of a function
function combine(
  input1: Combinable,
  input2: Combinable,
  // resultType is literal where we specified possible values
  resultType: ConversionDescriptor
) {
  let result;

  // this typeof check is always required when working with union types
  if (resultType == "as-number") {
    result = +input1 + +input2;
  } else {
    result = input1.toString() + input2.toString();
  }

  return result;
}

// and if we don't enter the valid value for resultType,
// are aware of that thanks to the defined literal
const combinedAges = combine(30, 26, "as-number");
console.log(combinedAges);

const combinedNames = combine("Filip", "Anita", "as-text");
console.log(combinedNames);
