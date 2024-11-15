# Sistema Lista de Tarefas - Teste Técnico Fattocs

Este repósitorio contém um projeto web que foi desenvolvido como parte de um teste técnico da *Fatto Consultoria e Sistemas*. O sistema permite o cadastro, edição, exclusão, e organização de tarefas.

Deploy:


## Tecnologias Usadas


<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-%23323330?style=for-the-badge&logo=typescript&logoColor=%233178C6)
![React](https://img.shields.io/badge/react-%2320232a?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Material UI](https://img.shields.io/badge/Material_UI-%23007FFF?style=for-the-badge&logo=material-ui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-%2307405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-%23000000?style=for-the-badge&logo=netlify&logoColor=white)

</div>

<div align="center">
<!-- 
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-%23EC5990?style=for-the-badge&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-%231C1C1C?style=for-the-badge&logo=axios&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-%23593d88?style=for-the-badge&logo=redux&logoColor=white)
![React Icons](https://img.shields.io/badge/React_Icons-%230F64A1?style=for-the-badge&logo=react&logoColor=white)
![react-beautiful-dnd](https://img.shields.io/badge/react_beautiful_dnd-%23FF8A00?style=for-the-badge&logo=react&logoColor=white) -->

</div>


## Funcionalidades
### 1. **Lista de Tarefas**
- Exibe todas as tarefas cadastradas.
- A lista é ordenada pelo campo "Ordem de apresentação".
- Exibe os seguintes campos para cada tarefa:
  - Nome da Tarefa
  - Custo (R$)
  - Data Limite
- As tarefas com **Custo** maior ou igual a **R$ 1.000,00** são destacadas (por exemplo, com fundo amarelo).
- Cada tarefa possui dois botões para:
  - **Editar**: Permite editar a tarefa (Nome, Custo, Data Limite).
  - **Excluir**: Exclui a tarefa com confirmação (Sim/Não).
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
- A nova tarefa será adicionada ao final da lista, de acordo com a ordem de apresentação.

### 5. **Reordenação das Tarefas**
- O usuário pode alterar a ordem de apresentação das tarefas:
  - **Arrastar e soltar (drag-and-drop)**: O usuário pode arrastar uma tarefa para cima ou para baixo na lista.
  - **Botões de subir/descer**: Cada tarefa possui botões para mover a tarefa para cima ou para baixo na ordem. A primeira tarefa não pode subir e a última não pode descer.