import { Draggable } from "../models/drag-drop.js";
import { ProjectModel } from "../models/project.js";
import { Component } from "./base-component.js";
import { Autobind } from "../decorators/autobind.js";

// project item 132
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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

  @Autobind
  dragStartHandler(event: DragEvent): void {
    console.log(this.project.id);
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move"; // controls the cursor will be shown
  }

  // @Autobind
  dragEndHandler(event: DragEvent): void {
    console.log(event);
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.getPersons + " assigned.";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
