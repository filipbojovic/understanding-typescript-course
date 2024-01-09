// autobind decorator
export function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  // the method we originally defined (submitHandler)
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    // get will be executed when we try to access the function
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjDescriptor;
}
