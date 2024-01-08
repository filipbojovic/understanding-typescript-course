// autobind decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
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

// this class should render the form once it is instantiated.
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement; // here we will show our content
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
    // holds ref to the el where we want to render content
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedHtmlContent = document.importNode(this.templateElement.content, true); // true is for deep clone()

    // here we accessed the element we want to render (form el)
    this.element = importedHtmlContent.firstElementChild as HTMLFormElement;
    // this will apply css to the element because of app.css
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector("#title")! as HTMLInputElement; // '#' when we fetch by id, but not by el name
    this.descriptionInputElement = this.element.querySelector("#description")! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector("#people")! as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      console.log(title, description, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler); // this.submitHandler.bind(this)
  }

  private attach() {
    // insertAdjacentElement is provided by the JS by default
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projectInput = new ProjectInput();
