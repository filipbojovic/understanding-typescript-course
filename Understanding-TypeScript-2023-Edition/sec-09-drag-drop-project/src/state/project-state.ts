import { ProjectModel } from "../models/project";
import { ProjectStatus } from "../models/project";

type Listener<T> = (items: T[]) => void;

// state management class
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<ProjectModel> {
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
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const existingProject = this.projects.find((proj) => proj.id === projectId);
    if (existingProject && existingProject.status != newStatus) {
      existingProject.status = newStatus;
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // slice will send a copy
    }
  }
}
export const projectState = ProjectState.getInstance();
