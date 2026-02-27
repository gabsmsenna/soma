# Guia de Testes - Soma

Este diretório contém a suíte de testes do projeto Soma, dividida em testes unitários e de integração.
Os testes são executados utilizando **Vitest** sob o capô.

## Estrutura de Diretórios

- **/tests/unit**: Arquivos de testes unitários, isolados de banco de dados e APIs externas. Onde mocks (`vi.mock()`) são fortemente encorajados. 
- **/tests/integration**: Testes de integração, focados em testar o sistema interagindo com o banco de dados e rotas da API em requisições simuladas.
- **/tests/utils**: Assistentes de teste, contendo:
  - **/factories**: Geração de dados dummy e de entidades com `faker`.
  - **/helpers**: Funções auxiliares (ex: parse de requisições, `createMockRequest`).
  - **/setup**: Configurações globais, como `vitest-setup.ts` e criação/limpeza provisória do *Test Database* (`test-db.ts`).

## Tecnologias Usadas

- **Vitest**: Framework de execução de testes.
- **Prisma**: Utilizamos o client injetado ou nativamente (nos testes de integração) interagindo com um banco Postgres local *apenas para testes*.
- **Zod**: Validações das requisições são testadas assertivamente através dos DTOs.
- **Faker**: Criação de dados aleatórios e massas de testes genéricas via factories.

## Como Executar os Testes

Com os scripts configurados no `package.json`, você pode rodar:

- `pnpm run test`: Executa todos os testes no ecossistema atual em modo watch.
- `pnpm run test:unit`: Roda estritamente a bateria de testes unitários.
- `pnpm run test:integration`: Executa estritamente a bateria de testes de integração, rodando de forma linear (sem `fileParallelism`) para evitar deadlocks no DB.
- `pnpm run test:coverage`: Roda a suíte completa com relatório de cobertura (v8).

## Banco de Dados de Teste

O ambiente de integração consome o banco de testes isolado que deve estar exposto via URL nas variáveis do ambiente especial de teste (`.env.test`). O setup (`setupTestDatabase()`) roda migrações via `prisma db push` sob a URL `DATABASE_URL_TEST` (que substitui momentaneamente a do env) antes da execução dos testes. O encerramento também descarta conexões pendentes do banco através do `teardownTestDatabase()`. 

**Obs:** O Client do Prisma no ambiente de integração foi projetado para descartar instâncias de poolers como adapter-pg para maior estabilidade local do teste, lidando nativamente com a engine Client. Se houver problemas com transações SCRAM, verifique a flag `sslmode` na connection string do `.env.test`.

## Padrões de Nomenclatura

- Arquivos de teste sempre terminam com `.test.ts`. Ex: `operation.service.test.ts`.
- Descreva as `describe()` blocks em inglês ou português que evidenciem claramente qual classe/módulo ou Rota HTTP está sendo avaliada.
- Escreva a expectativa dentro do `it()` usando a sintaxe de comportamento esperado claro ("deve criar...", "should return 400 when...").
