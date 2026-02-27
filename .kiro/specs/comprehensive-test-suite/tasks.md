# Implementation Plan: Comprehensive Test Suite

## Overview

Implementar uma bateria completa de testes para o projeto Next.js usando Vitest, incluindo testes unitários para serviços, testes de integração para APIs, test database isolado, utilities de teste, e configuração de cobertura de código.

## Tasks

- [x] 1. Configurar infraestrutura de testes

  - [x] 1.1 Instalar dependências de teste
    - Instalar vitest, @vitejs/plugin-react, jsdom, @faker-js/faker com pnpm
    - Instalar @types/node se necessário com pnpm
    - _Requirements: 1.1_
  
  - [x] 1.2 Criar configuração do Vitest
    - Criar `vitest.config.ts` na raiz do projeto
    - Configurar jsdom como environment
    - Configurar path aliases (@/) para testes
    - Configurar coverage com v8 provider (threshold 80%)
    - _Requirements: 1.2, 6.1_
  
  - [x] 1.3 Criar estrutura de diretórios de teste
    - Criar `tests/unit/services/`
    - Criar `tests/unit/lib/`
    - Criar `tests/integration/api/`
    - Criar `tests/utils/factories/`
    - Criar `tests/utils/mocks/`
    - Criar `tests/utils/helpers/`
    - Criar `tests/utils/setup/`
    - _Requirements: 1.3_

- [x] 2. Configurar test database e setup
  - [ ] 2.1 Criar configuração de test database
    - Criar `tests/utils/setup/test-db.ts` com funções para setup/teardown
    - Implementar lógica para criar/limpar database entre testes
    - Usar variável de ambiente `DATABASE_URL_TEST`
    - _Requirements: 4.1, 4.2_
  
  - [x] 2.2 Criar setup global do Vitest
    - Criar `tests/utils/setup/vitest-setup.ts`
    - Configurar beforeAll/afterAll para database
    - Configurar beforeEach para limpar dados entre testes
    - _Requirements: 4.3_

- [x] 3. Implementar test utilities
  - [x] 3.1 Criar factories de dados
    - Criar `tests/utils/factories/user.factory.ts` usando @faker-js/faker
    - Criar `tests/utils/factories/operation.factory.ts`
    - Criar `tests/utils/factories/project.factory.ts`
    - Criar `tests/utils/factories/creative.factory.ts`
    - Cada factory deve gerar dados válidos para testes
    - _Requirements: 5.1_
  
  - [x] 3.2 Criar mocks de Prisma
    - Criar `tests/utils/mocks/prisma.mock.ts`
    - Implementar mock do Prisma Client para testes unitários
    - Criar helpers para mockar operações CRUD
    - _Requirements: 5.2_
  
  - [x] 3.3 Criar test helpers
    - Criar `tests/utils/helpers/auth.helper.ts` para gerar tokens JWT de teste
    - Criar `tests/utils/helpers/request.helper.ts` para simular requests HTTP
    - Criar `tests/utils/helpers/assertion.helper.ts` com assertions customizadas
    - _Requirements: 5.3_

- [x] 4. Checkpoint - Validar infraestrutura de testes
  - Executar `pnpm run test` para verificar que a configuração está funcionando
  - Perguntar ao usuário se há dúvidas ou ajustes necessários

- [x] 5. Implementar testes unitários para AuthService
  - [x] 5.1 Criar arquivo de teste para AuthService
    - Criar `tests/unit/services/auth.service.test.ts`
    - Configurar mocks do Prisma e bcrypt
    - _Requirements: 2.1_
  
  - [x] 5.2 Escrever testes para register()
    - Testar criação de usuário com sucesso
    - Testar erro quando email já existe
    - Testar hash de senha
    - _Requirements: 2.1_
  
  - [x] 5.3 Escrever testes para login()
    - Testar login com credenciais válidas
    - Testar erro com credenciais inválidas
    - Testar geração de token JWT
    - _Requirements: 2.1_
  
  - [x] 5.4 Escrever testes para validateToken()
    - Testar validação de token válido
    - Testar erro com token inválido
    - Testar erro com token expirado
    - _Requirements: 2.1_

- [x] 6. Implementar testes unitários para OperationService
  - [x] 6.1 Criar arquivo de teste para OperationService
    - Criar `tests/unit/services/operation.service.test.ts`
    - Configurar mocks do Prisma
    - _Requirements: 2.2_
  
  - [x]* 6.2 Escrever testes para create()
    - Testar criação de operação com sucesso
    - Testar validação de dados obrigatórios
    - Testar associação com usuário
    - _Requirements: 2.2_
  
  - [x]* 6.3 Escrever testes para findAll() e findById()
    - Testar listagem de operações
    - Testar busca por ID existente
    - Testar erro quando operação não existe
    - _Requirements: 2.2_
  
  - [x]* 6.4 Escrever testes para update() e delete()
    - Testar atualização de operação
    - Testar deleção de operação
    - Testar erros de validação
    - _Requirements: 2.2_

- [x] 7. Implementar testes unitários para ProjectService
  - [x] 7.1 Criar arquivo de teste para ProjectService
    - Criar `tests/unit/services/project.service.test.ts`
    - Configurar mocks do Prisma
    - _Requirements: 2.3_
  
  - [x]* 7.2 Escrever testes para create()
    - Testar criação de projeto com sucesso
    - Testar associação com operação
    - Testar validação de dados
    - _Requirements: 2.3_
  
  - [x]* 7.3 Escrever testes para findAll() e findById()
    - Testar listagem de projetos por operação
    - Testar busca por ID
    - Testar filtros e paginação
    - _Requirements: 2.3_
  
  - [x]* 7.4 Escrever testes para update() e delete()
    - Testar atualização de projeto
    - Testar deleção de projeto
    - Testar cascade de relacionamentos
    - _Requirements: 2.3_

- [x] 8. Implementar testes unitários para CreativeService
  - [x] 8.1 Criar arquivo de teste para CreativeService
    - Criar `tests/unit/services/creative.service.test.ts`
    - Configurar mocks do Prisma
    - _Requirements: 2.4_
  
  - [x]* 8.2 Escrever testes para create()
    - Testar criação de creative com sucesso
    - Testar associação com projeto
    - Testar validação de dados
    - _Requirements: 2.4_
  
  - [x]* 8.3 Escrever testes para findAll() e findById()
    - Testar listagem de creatives por projeto
    - Testar busca por ID
    - Testar filtros
    - _Requirements: 2.4_
  
  - [x]* 8.4 Escrever testes para update() e delete()
    - Testar atualização de creative
    - Testar deleção de creative
    - _Requirements: 2.4_

- [x] 9. Checkpoint - Validar testes unitários
  - Executar `pnpm run test:unit` para verificar todos os testes unitários
  - Verificar cobertura de código dos serviços
  - Perguntar ao usuário se há ajustes necessários

- [x] 10. Implementar testes de integração para endpoints de autenticação
  - [x] 10.1 Criar arquivo de teste para /api/auth/register
    - Criar `tests/integration/api/auth-register.test.ts`
    - Usar test database real
    - _Requirements: 3.1_
  
  - [x]* 10.2 Escrever testes para POST /api/auth/register
    - Testar registro com dados válidos
    - Testar erro 409 quando email já existe
    - Testar erro 400 com dados inválidos
    - Validar formato de resposta (Problem Details)
    - _Requirements: 3.1_
  
  - [x] 10.3 Criar arquivo de teste para /api/auth/login
    - Criar `tests/integration/api/auth-login.test.ts`
    - _Requirements: 3.2_
  
  - [x]* 10.4 Escrever testes para POST /api/auth/login
    - Testar login com credenciais válidas
    - Testar erro 401 com credenciais inválidas
    - Testar geração de token JWT
    - Validar formato de resposta
    - _Requirements: 3.2_

- [x] 11. Implementar testes de integração para endpoints de operations
  - [x] 11.1 Criar arquivo de teste para /api/operations
    - Criar `tests/integration/api/operations.test.ts`
    - Configurar autenticação com token JWT
    - _Requirements: 3.3_
  
  - [x]* 11.2 Escrever testes para GET e POST /api/operations
    - Testar listagem de operações (autenticado)
    - Testar criação de operação
    - Testar erro 401 sem autenticação
    - Testar validação de dados
    - _Requirements: 3.3_
  
  - [x] 11.3 Criar arquivo de teste para /api/operations/[id]
    - Criar `tests/integration/api/operations-id.test.ts`
    - _Requirements: 3.4_
  
  - [x]* 11.4 Escrever testes para GET, PUT, DELETE /api/operations/[id]
    - Testar busca por ID
    - Testar atualização de operação
    - Testar deleção de operação
    - Testar erro 404 quando não existe
    - _Requirements: 3.4_

- [x] 12. Implementar testes de integração para endpoints de projects
  - [x] 12.1 Criar arquivo de teste para /api/operations/[id]/projects
    - Criar `tests/integration/api/projects.test.ts`
    - Configurar autenticação
    - _Requirements: 3.5_
  
  - [x]* 12.2 Escrever testes para GET e POST /api/operations/[id]/projects
    - Testar listagem de projetos por operação
    - Testar criação de projeto
    - Testar validação de dados
    - Testar erro 404 quando operação não existe
    - _Requirements: 3.5_
  
  - [x] 12.3 Criar arquivo de teste para /api/operations/[id]/projects/[projectId]
    - Criar `tests/integration/api/projects-id.test.ts`
    - _Requirements: 3.6_
  
  - [x]* 12.4 Escrever testes para GET, PUT, DELETE /api/operations/[id]/projects/[projectId]
    - Testar busca por ID
    - Testar atualização de projeto
    - Testar deleção de projeto
    - Testar erros 404
    - _Requirements: 3.6_

- [x] 13. Checkpoint - Validar testes de integração
  - [x] Executar `pnpm run test:integration` para verificar todos os testes de integração
  - [x] Verificar que test database está sendo limpo corretamente
  - [x] Perguntar ao usuário se há ajustes necessários

- [x] 14. Configurar scripts de teste no package.json
  - [x] 14.1 Adicionar scripts de teste
    - [x] Adicionar `"test": "vitest"`
    - [x] Adicionar `"test:unit": "vitest run tests/unit"`
    - [x] Adicionar `"test:integration": "vitest run tests/integration"`
    - Adicionar `"test:coverage": "vitest run --coverage"`
    - Adicionar `"test:watch": "vitest watch"`
    - _Requirements: 7.1_

- [x] 15. Criar documentação de testes
  - [x] 15.1 Criar guia de testes
    - [x] Criar `tests/README.md` com instruções de uso
    - [x] Documentar estrutura de diretórios
    - [x] Documentar padrões de nomenclatura
    - [x] Documentar como usar factories e mocks
    - [x] Documentar como configurar test database
    - _Requirements: 8.1_
  
  - [ ] 15.2 Adicionar exemplos de testes
    - Incluir exemplos de testes unitários
    - Incluir exemplos de testes de integração
    - Incluir exemplos de uso de factories
    - _Requirements: 8.2_

- [x] 16. Validação final e ajustes
  - [x] 16.1 Executar bateria completa de testes
    - [x] Executar `pnpm run test:coverage`
    - [x] Verificar que cobertura está >= 80%
    - [x] Verificar que todos os testes passam
    - _Requirements: 6.2_
  
  - [x] 16.2 Executar linter e formatter
    - [x] Executar `pnpm run lint` nos arquivos de teste
    - [x] Executar `pnpm run format` nos arquivos de teste
    - [x] Corrigir quaisquer problemas encontrados
    - _Requirements: 1.4_

- [x] 17. Checkpoint final - Revisão completa
  - [x] Garantir que todos os testes passam
  - [x] Garantir que cobertura de código está adequada
  - [x] Perguntar ao usuário se há ajustes finais necessários

## Notes

- Tasks marcadas com `*` são opcionais e podem ser puladas para MVP mais rápido
- Cada task referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Testes unitários usam mocks do Prisma para isolamento
- Testes de integração usam test database real
- Cobertura mínima de 80% é obrigatória
- Todos os testes devem seguir padrões do Biome (2 espaços, LF)
- Use path alias `@/` para imports nos testes
- Factories usam @faker-js/faker para dados realistas
- Test database deve ser isolado do database de desenvolvimento
