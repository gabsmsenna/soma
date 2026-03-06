# PRD - Gestao e Relatorio de Lucros de Freelancers

## 1. Visao Geral

O objetivo desta feature e permitir que freelancers consultem os lucros (comissoes) obtidos nos ultimos meses e que o sistema registre pagamentos realizados, zerando o saldo atual para novo acumulo.

A funcionalidade se divide em dois eixos:

1. **Acao "Marcar Pago"**: Registra o pagamento de comissao de um criativo, salva o historico e zera o saldo para novo acumulo.
2. **Relatorio de Lucros**: Nova pagina que permite ao usuario consultar, filtrar e detalhar os pagamentos registrados, agrupados por operacao.

---

## 2. User Stories

### US-01: Marcar Pagamento de Comissao

**Como** freelancer,
**quero** marcar a comissao de um criativo como paga,
**para que** o saldo seja zerado e eu possa acompanhar um novo ciclo de acumulo.

**Criterios de Aceite:**
- Na tela de saldo atual, existe um botao "Marcar Pago" para cada criativo.
- Ao clicar, o sistema captura o valor atual de comissao e o lucro total do criativo.
- Um registro de pagamento e salvo no banco de dados.
- O valor de comissao do criativo e zerado apos o registro.
- O usuario recebe feedback visual de sucesso.

### US-02: Consultar Relatorio de Lucros

**Como** freelancer,
**quero** acessar uma pagina de relatorio de lucros,
**para que** eu possa consultar o historico de pagamentos realizados.

**Criterios de Aceite:**
- Existe uma pagina dedicada de "Relatorio de Lucros" acessivel pelo menu.
- A pagina exibe os dados agrupados por Operacao.
- Para cada operacao, e exibido o lucro total da operacao e o valor de comissao do freelancer.

### US-03: Filtrar Relatorio por Data

**Como** freelancer,
**quero** filtrar o relatorio de lucros por um intervalo de datas,
**para que** eu possa consultar periodos especificos.

**Criterios de Aceite:**
- Existe um filtro de data na pagina de relatorio.
- O intervalo maximo de busca e de 30 dias.
- Caso o usuario selecione um intervalo superior a 30 dias, o sistema exibe uma mensagem de erro.

### US-04: Detalhar Lucros por Criativo (Drill-down)

**Como** freelancer,
**quero** clicar em uma operacao no relatorio para ver os criativos vinculados,
**para que** eu possa entender a composicao do lucro de cada operacao.

**Criterios de Aceite:**
- Ao clicar em uma operacao, a interface expande/abre uma lista detalhada.
- Cada criativo exibe seu valor de lucro total e o valor de comissao que o freelancer recebeu.
- O drill-down pode ser recolhido/fechado.

---

## 3. Regras de Negocio

| ID | Regra |
|----|-------|
| RN-01 | Um criativo pode ter multiplos registros de pagamento ao longo do tempo. |
| RN-02 | Ao registrar um pagamento, o valor de comissao do criativo e zerado para novo acumulo. |
| RN-03 | O valor registrado no historico deve ser o valor exato no momento do clique, sem arredondamentos adicionais. |
| RN-04 | O filtro de data no relatorio tem limite maximo de 30 dias. |
| RN-05 | O relatorio agrupa os dados por operacao, permitindo drill-down por criativo. |
| RN-06 | Somente o proprio usuario (freelancer autenticado) pode visualizar e registrar pagamentos dos seus criativos. |

---

## 4. Requisitos de Interface (UI/UX)

### 4.1 Tela de Saldo Atual (Modificacao)

- Adicionar botao **"Marcar Pago"** na area de cada criativo.
- Ao clicar no botao, exibir um dialog de confirmacao com o valor que sera registrado.
- Apos confirmacao, exibir feedback de sucesso (toast) e atualizar a interface com o saldo zerado.

### 4.2 Pagina de Relatorio de Lucros (Nova)

**Rota sugerida:** `/relatorio-lucros`

**Layout:**
- **Cabecalho:** Titulo "Relatorio de Lucros" com filtro de data (date range picker).
- **Validacao do filtro:** Intervalo maximo de 30 dias; exibir mensagem de erro se excedido.
- **Lista principal:** Agrupada por Operacao, exibindo:
  - Nome da operacao
  - Lucro total da operacao
  - Valor de comissao do freelancer
- **Drill-down:** Ao clicar em uma operacao, expande uma sublista com os criativos:
  - Nome do criativo
  - Lucro total do criativo
  - Valor de comissao do freelancer

**Comportamento:**
- O drill-down funciona como um accordion (expandir/recolher).
- A pagina deve ser responsiva e suportar dark mode.

---

## 5. Requisitos de Dados (Esquema de Banco de Dados)

### 5.1 Nova Tabela: `ProfitPayment`

Tabela para armazenar o historico de pagamentos de lucros do freelancer.

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| `id` | String (cuid) | Chave primaria |
| `id_usuario` | String (FK) | Referencia ao usuario (freelancer) que recebeu o pagamento |
| `id_criativo` | String (FK) | Referencia ao criativo associado ao pagamento |
| `total_comissao_paga` | Float | Valor da comissao paga ao freelancer no momento do registro |
| `lucro_total_criativo` | Float | Lucro total do criativo no momento do registro |
| `data_pagamento` | DateTime | Data e hora em que o pagamento foi registrado |

**Relacionamentos:**
- `id_usuario` -> `User.id`
- `id_criativo` -> `Creative.id`

**Indices:**
- Indice composto em `(id_usuario, data_pagamento)` para otimizar consultas do relatorio filtradas por data.

### 5.2 Impacto em Tabelas Existentes

- **`Creative`**: O campo de comissao existente sera zerado apos cada registro de pagamento. Nenhuma alteracao de schema necessaria.

---

## 6. Resumo de Endpoints / Server Actions

| Tipo | Nome | Descricao |
|------|------|-----------|
| Server Action | `registerProfitPayment` | Registra o pagamento, salva historico e zera comissao do criativo |
| Server Component (fetch) | Pagina de Relatorio | Busca os registros de pagamento agrupados por operacao, com filtro de data |
