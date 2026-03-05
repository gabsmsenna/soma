export type ActionResult<T = void> =
  | { success: true; data: T }
  | {
      success: false;
      error: { title: string; detail: string; status: number };
    };
