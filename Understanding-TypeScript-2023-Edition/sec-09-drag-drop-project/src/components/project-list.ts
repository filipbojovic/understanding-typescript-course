import { Component } from "./base-component";
import { ProjectModel } from "../models/project";
import { Autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";
import { ProjectStatus } from "../models/project";
import { ProjectItem } from "./project-item";
import { DragTarget } from "../models/drag-drop";

// ProjectList class 127
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: ProjectModel[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent(); // this will be called before renderProjects() above
  }

  @Autobind
  dragOverHandler(event: DragEvent): void {
    // we set text/plain above
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault(); // the default for js is to not allow dropping, so we have to prevent that
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      projectId,
      this.type === "active" ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent): void {
    // remove blue background
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

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
