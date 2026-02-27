import { AppError } from "./app-error";

const BASE_URI = "https://soma.api/problems";

const PROBLEM_TYPES = {
  RESOURCE_NOT_FOUND: {
    type: `${BASE_URI}/resource-not-found`,
    title: "Recurso não encontrado",
    status: 404,
  },
  INVALID_CREDENTIALS: {
    type: `${BASE_URI}/invalid-credentials`,
    title: "Credenciais inválidas",
    status: 401,
  },
  INVALID_TOKEN: {
    type: `${BASE_URI}/invalid-token`,
    title: "Token inválido",
    status: 401,
  },
  EMAIL_ALREADY_EXISTS: {
    type: `${BASE_URI}/email-already-exists`,
    title: "E-mail já cadastrado",
    status: 409,
  },
  VALIDATION_ERROR: {
    type: `${BASE_URI}/validation-error`,
    title: "Erro de validação",
    status: 400,
  },
  INTERNAL_ERROR: {
    type: `${BASE_URI}/internal-error`,
    title: "Erro interno do servidor",
    status: 500,
  },
} as const;

function createAppError(
  key: keyof typeof PROBLEM_TYPES,
  detail?: string,
  extensions?: Record<string, unknown>,
): AppError {
  const base = PROBLEM_TYPES[key];
  return new AppError(base.type, base.title, base.status, detail, extensions);
}

export const problems = {
  resourceNotFound: (detail?: string) =>
    createAppError("RESOURCE_NOT_FOUND", detail),

  invalidCredentials: (detail?: string) =>
    createAppError(
      "INVALID_CREDENTIALS",
      detail ?? "E-mail ou senha incorretos",
    ),

  invalidToken: (detail?: string) =>
    createAppError(
      "INVALID_TOKEN",
      detail ?? "O token fornecido é inválido ou expirou",
    ),

  emailAlreadyExists: (detail?: string) =>
    createAppError(
      "EMAIL_ALREADY_EXISTS",
      detail ?? "Já existe uma conta com este e-mail",
    ),

  validationError: (detail?: string, errors?: Record<string, unknown>) =>
    createAppError("VALIDATION_ERROR", detail, errors ? { errors } : undefined),

  internalError: (detail?: string) => createAppError("INTERNAL_ERROR", detail),
};
