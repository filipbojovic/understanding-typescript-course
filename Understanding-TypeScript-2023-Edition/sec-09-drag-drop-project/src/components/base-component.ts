// Component base class
// the first is where we will render something
// the snd param is the element we do render
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
