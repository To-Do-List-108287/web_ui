export class TaskSortingOption {
  static CREATION_DATE_ASC = new TaskSortingOption('creationDate,asc', 'Creation Date, old to new');
  static CREATION_DATE_DESC = new TaskSortingOption('creationDate,desc', 'Creation Date, new to old');
  static DEADLINE_ASC = new TaskSortingOption('deadline,asc', 'Deadline Date, old to new');
  static DEADLINE_DESC = new TaskSortingOption('deadline,desc', 'Deadline Date, new to old');

  private constructor(public readonly sortName: string, public readonly displayName: string) {}
}

const allTaskSortingOptions: TaskSortingOption[] = [
  TaskSortingOption.CREATION_DATE_DESC,
  TaskSortingOption.CREATION_DATE_ASC,
  TaskSortingOption.DEADLINE_DESC,
  TaskSortingOption.DEADLINE_ASC,
]
export { allTaskSortingOptions }
