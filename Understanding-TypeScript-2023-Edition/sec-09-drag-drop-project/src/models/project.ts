export enum ProjectStatus {
  ACTIVE,
  FINISHED,
}

export class ProjectModel {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
