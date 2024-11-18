# Sistema Lista de Tarefas - Teste Técnico Fattocs

Este repósitorio contém o código front-end de um projeto web que foi desenvolvido como parte de um teste técnico da *Fatto Consultoria e Sistemas*. O sistema permite o cadastro, edição, exclusão, e organização de tarefas.

Repósitorio Back-end: [Lista de Tarefas-API](https://github.com/Pedroo722/Lista_de_Tarefas-API)

Deploy: https://teste-tecnico-pedro-fattocs.netlify.app/


## Tecnologias Usadas


<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-%23323330?style=for-the-badge&logo=typescript&logoColor=%233178C6)
![React](https://img.shields.io/badge/react-%2320232a?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Material UI](https://img.shields.io/badge/Material_UI-%23007FFF?style=for-the-badge&logo=material-ui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-%23000000?style=for-the-badge&logo=netlify&logoColor=white)

</div>


## Funcionalidades
### 1. **Lista de Tarefas**
- Exibe todas as tarefas cadastradas em uma tabela.
- A tabela é paginada, exibindo até 7 tarefas de uma única vez.
- A lista é ordenada pelo campo "Ordem de apresentação".
- Exibe os seguintes campos para cada tarefa:
  - Nome da Tarefa
  - Custo (R$)
  - Data Limite
- As tarefas com **Custo** maior ou igual a **R$ 1.000,00** são destacadas (por meio de um fundo amarelo).
- Cada tarefa possui dois botões para:
  - **Editar**: Permitindo editar a tarefa (Nome, Custo, Data Limite).
  - **Excluir**: Exclui a tarefa com uma pequena caixa confirmação.
- Ao final da lista, há um botão **Incluir** para adicionar uma nova tarefa.

### 2. **Excluir**
- Ao clicar no botão de excluir, o sistema apresenta uma confirmação de exclusão.
- Caso o usuário confirme, a tarefa é removida da lista.

### 3. **Editar**
- O usuário pode editar as seguintes informações de cada tarefa:
  - Nome da Tarefa
  - Custo (R$)
  - Data Limite
- A edição pode ser feita de duas formas:
  - **Edição direta na tela principal**: Os campos são habilitados para edição.
  - **Popup**: Uma nova tela ou modal aparece para o usuário editar as informações.
- Não é permitido editar o nome da tarefa para um nome que já exista na base de dados.

### 4. **Incluir**
- O usuário pode adicionar uma nova tarefa com os seguintes campos:
  - Nome da Tarefa
  - Custo (R$)
  - Data Limite
- O identificador e a ordem de apresentação são gerados automaticamente.
- A nova tarefa é adicionada ao final da lista, de acordo com a ordem de apresentação.

### 5. **Reordenação das Tarefas**
- O usuário pode alterar a ordem de apresentação das tarefas:
  - **Arrastar e soltar (drag-and-drop)**: O usuário pode arrastar uma tarefa para cima ou para baixo na lista.
  - **Botões de subir/descer**: Cada tarefa possui botões para mover a tarefa para cima ou para baixo na ordem. A primeira tarefa não pode subir e a última não pode descer.

### Funcionalidade Adicionais
- Uma barra de pesquisa que permite o usuário rapidamente filtrar uma tarefa pelo nom.
- O sistema tem um design responsivo, permitindo o uso em dispositivos móveis.