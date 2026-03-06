# Implementation Plan — Gestão e Relatório de Lucros de Freelancers

## Task 1: Add ProfitPayment model to Prisma schema
- [x] Add `ProfitPayment` model with fields: id, userId, creativeId, totalComissaoPaga, lucreTotalCriativo, dataPagamento
- [x] Add relations to User and Creative models
- [x] Add composite index on (userId, dataPagamento)
- [x] Run `pnpm run db:push` to update DB
- [x] Run `pnpm run db:generate` to regenerate Prisma client

## Task 2: Add registerProfitPayment service function (TDD)
- [x] Write tests for `registerProfitPayment` action in actions.test.ts
- [x] Add `registerProfitPayment` function to creative.service.ts (saves payment + zeros freelancerCut in transaction)
- [x] Add `registerProfitPayment` server action to criativos/actions.ts

## Task 3: Update "Marcar Pago" UI with confirmation dialog
- [x] Create `mark-paid-confirmation-dialog.tsx` component showing current commission value
- [x] Update `creative-action-buttons.tsx` to use the new dialog, show button when freelancerCut > 0
- [x] Add toast success/error feedback using sonner

## Task 4: Create /relatorio-lucros page
- [x] Add `findProfitPaymentsGroupedByOperation` service function with date range filter
- [x] Create `/app/(dashboard)/relatorio-lucros/page.tsx` as Server Component with URL search params for date
- [x] Create client component for date range filter (max 30 days, shows validation error)
- [x] Create accordion component for operation groups with creative drill-down

## Task 5: Add Relatório de Lucros to sidebar
- [x] Add "Relatório de Lucros" nav item with DollarSign icon pointing to /relatorio-lucros
