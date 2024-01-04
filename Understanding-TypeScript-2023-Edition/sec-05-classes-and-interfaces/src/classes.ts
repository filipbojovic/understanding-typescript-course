abstract class Department {
  //   private id: string;
  //   private name: string;
  protected employees: string[] = [];
  public static fiscalYear = 2024;

  constructor(protected readonly id: string, public name: string) {
    // this.name = n;
  }

  static createEmployee(name: string) {
    return { name: name };
  }

  //   describe(this: Department): void {
  //     console.log(`Department (${this.id}): ${this.name}` + this.name);
  //   }

  abstract describe(this: Department): void;

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

class ITDepartment extends Department {
  constructor(id: string, name: string, public admins: string[]) {
    super(id, name);
  }

  describe(): void {
    console.log(`IT department with id = ${this.id}`);
  }
}

class AccountingDepartment extends Department {
  private lastReport: string;
  private static instance: AccountingDepartment;

  private constructor(id: string, name: string, private reports: string[]) {
    super(id, name);
    this.lastReport = reports[0];
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new AccountingDepartment("accID", "Acc Department", []);
      return this.instance;
    }
  }

  describe() {
    console.log(`Accounting department with id = ${this.id}`);
  }

  addEmployee(employee: string): void {
    if (employee === "Fika") {
      return;
    }
    this.employees.push(employee);
  }

  addReport(text: string) {
    this.lastReport = text;
    this.reports.push(text);
  }

  printReports() {
    console.log(this.reports);
  }

  get getLastReport() {
    return this.lastReport;
  }

  set setLastReport(report: string) {
    this.lastReport = report;
  }
}

// abstract class
// const d = new Department("1", "d");
// d.addEmployee("Fika");
// d.addEmployee("Anita");
// d.printEmployeeInformation();
// console.log(d);

// const dCopy = { name: "s", describe: d.describe };
// dCopy.describe();

// 65
const it = new ITDepartment("2", "ISL", ["Fika"]);
console.log(it);

// const acc = new AccountingDepartment("3", "accounting dep", []);
const acc = AccountingDepartment.getInstance();
acc.addReport("something went wrong");
acc.printReports();
acc.describe();

const employee1 = Department.createEmployee("Fika");
console.log(employee1);
