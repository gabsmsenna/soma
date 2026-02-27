export class AppError extends Error {
  constructor(
    public readonly type: string,
    public readonly title: string,
    public readonly status: number,
    public readonly detail?: string,
    public readonly extensions?: Record<string, unknown>,
  ) {
    super(detail ?? title);
    this.name = "AppError";
  }
}
