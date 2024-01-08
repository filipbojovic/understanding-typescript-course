// Project TYpe

enum ProjectStatus {
  ACTIVE,
  FINISHED,
}

class ProjectModel {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener<T> = (items: T[]) => void;

// state management class
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
class ProjectState extends State<ProjectModel> {
  private projects: ProjectModel[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();

    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new ProjectModel(
      Math.random.toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.ACTIVE
    );

    this.projects.push(newProject);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // slice will send a copy
    }
  }
}
const projectState = ProjectState.getInstance();

// validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  // != null (with one equal sign) includes both 'null' and 'undefined'
  if (validatableInput.minLength != null && typeof validatableInput.value === "string") {
    isValid = isValid && validatableInput.value.length > validatableInput.minLength;
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === "string") {
    isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
  }
  if (validatableInput.min != null && typeof validatableInput.value === "number") {
    isValid = isValid && validatableInput.value > validatableInput.min;
  }
  if (validatableInput.max != null && typeof validatableInput.value === "number") {
    isValid = isValid && validatableInput.value < validatableInput.max;
  }

  return isValid;
}

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

// Component base class
// the first is where we will render something
// the snd param is the element we do render
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  // hostElementId - where to render a component
  // newElementId - id which can be assigned to the new element
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtBeginning: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedHtmlContent = document.importNode(this.templateElement.content, true); // true is for deep clone()
    // here we accessed to the first element of project-list content, which is a section
    this.element = importedHtmlContent.firstElementChild as U;
    // this will apply css to the element because of app.css
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtBeginning);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;

  abstract renderContent(): void;
}

// ProjectItem 132
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: ProjectModel;

  get getPersons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: ProjectModel) {
    super("single-project", hostId, false, project.id);

    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure() {}

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.getPersons + " assigned.";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

// ProjectList class 127
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: ProjectModel[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent(); // this will be called before renderProjects() above
  }

  configure() {
    projectState.addListener((projects: ProjectModel[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.ACTIVE;
        } else {
          return prj.status === ProjectStatus.FINISHED;
        }
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = ""; // why not textContent?
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
    }
  }
}

// this class should render the form once it is instantiated.
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElement = this.element.querySelector("#title")! as HTMLInputElement; // '#' when we fetch by id, but not by el name
    this.descriptionInputElement = this.element.querySelector("#description")! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector("#people")! as HTMLInputElement;
    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler); // this.submitHandler.bind(this)
  }

  renderContent(): void {
    return;
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
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
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
