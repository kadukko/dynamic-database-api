
# Dynamic Database API

## Descrição

A Dynamic Database API é uma poderosa aplicação desenvolvida em Node.js, Express e MongoDB, que permite a criação e manipulação de coleções dinâmicas. Com esta API, você pode criar coleções personalizadas e executar operações CRUD (Create, Read, Update, Delete) em objetos dessas coleções de forma flexível e adaptável.

Ao contrário dos bancos de dados tradicionais, onde as coleções e seus campos são definidos previamente, a Dynamic Database API permite que você defina dinamicamente as coleções e seus campos em tempo de execução. Isso oferece uma grande flexibilidade ao lidar com dados variáveis e evita a necessidade de definir um esquema fixo.

Principais recursos da Dynamic Database API:

-   **Criação de Coleções Personalizadas**: Você pode criar coleções personalizadas de acordo com as necessidades específicas da sua aplicação. Cada coleção pode ter seus próprios campos com tipos de dados definidos.
    
-   **Operações CRUD**: A API oferece operações CRUD completas (Create, Read, Update, Delete) para manipulação de objetos dentro das coleções. Você pode criar, ler, atualizar e excluir objetos de forma simples e intuitiva.
    
-   **Filtros Avançados**: A Dynamic Database API permite realizar consultas avançadas usando filtros personalizados. Você pode especificar filtros baseados em igualdade, desigualdade, expressões regulares, comparações numéricas e muito mais.
    
-   **Validação de Dados**: A API inclui validação de dados para garantir que os campos estejam corretos antes de serem inseridos no banco de dados. Isso ajuda a manter a integridade dos dados e a evitar inconsistências.
    
-   **Flexibilidade e Adaptabilidade**: Com a Dynamic Database API, você pode adaptar sua estrutura de dados de forma rápida e fácil. Adicione ou remova campos das coleções conforme necessário, sem a necessidade de migrações complexas.
    
-   **Arquitetura Escalável**: A aplicação foi projetada para ser escalável e pode lidar com grandes volumes de dados e tráfego simultâneo. A integração com o MongoDB oferece um desempenho eficiente e confiável.
    

A Dynamic Database API é uma solução versátil para casos de uso em que a estrutura de dados precisa ser flexível e adaptável. Seja para criar aplicativos web, sistemas de gerenciamento de conteúdo ou qualquer outra aplicação que exija um banco de dados dinâmico, a API fornece os recursos necessários para atender às suas necessidades.

Experimente a Dynamic Database API e liberte-se das restrições tradicionais de esquemas de banco de dados fixos!

## Requisitos de Instalação

Antes de executar a API, certifique-se de ter os seguintes requisitos instalados em seu ambiente:

- Node.js
- MongoDB

## Configuração

Siga as etapas abaixo para configurar e executar a API:

  1. Clone este repositório em sua máquina local.
```
git clone https://github.com/kadukko/dynamic-database-api.git
```

2. Navegue até o diretório raiz do projeto.
```
cd dynamic-database-api
```

3. Instale as dependências do projeto.
```
npm install

// ou

yarn
```

4. Duplique o arquivo `.env.example`, renome para `.env` e altere os valores das variáveis conforme a configuração do seu ambiente.
  
Certifique-se que a URI do seu servidor MongoDB possua o nome do banco de dados utilizado.

5. Inicie o servidor.

```
npm dev
yarn dev

// ou

npm build
npm start

yarn build
yarn start
```

  

6. A API estará acessível em `http://localhost:4000` por padrão.

  

## Rotas Disponíveis

A API possui as seguintes rotas disponíveis:
  
-  **GET /collections**: Retorna todas as coleções existentes.

-  **POST /collections**: Cria uma nova coleção.

-  **POST /collections/:id/fields**: Adiciona um novo campo à coleção especificada pelo ID.

-  **POST /collections/:id/objects**: Cria um novo objeto na coleção especificada pelo ID.

-  **POST /collections/:id/objects/search**: Realiza uma busca na coleção especificada pelos filtros fornecidos.

-  **GET /collections/:cid/objects/:id**: Retorna um objeto específico da coleção especificada pelo ID da coleção e do objeto.

-  **PUT /collections/:cid/objects/:id**: Atualiza um objeto existente na coleção especificada pelo ID da coleção e do objeto.

  

Certifique-se de substituir `:id` e `:cid` pelos IDs reais da coleção e do objeto desejados.


## Exemplo da Entrada das Rotas

As rotas da Dynamic Database API aceitam diferentes entradas de dados dependendo da funcionalidade específica que estão implementando. Vou explicar as entradas de dados para cada rota:

1. **POST /collections**: Para criar uma nova coleção, a rota espera um objeto JSON no corpo da requisição com a seguinte estrutura:
   ```json
   {
     "name": "nome_da_colecao"
   }
   ```
   O campo `name` representa o nome da coleção a ser criada.

2. **POST /collections/:id/fields**: Ao adicionar um novo campo a uma coleção, a rota requer um objeto JSON no corpo da requisição com a seguinte estrutura:
   ```json
   {
     "key": "nome_do_campo",
     "type": "tipo_do_campo",
     "required": true,
     "trim": true,
     "ref": "id_da_coleção" // can be null
   }
   ```
   Os campos `key`, `type`, `required` e `trim` representam o nome do campo, o tipo de dados do campo (string, number ou boolean), se o campo é obrigatório e se deve ser feito um trim nos dados.

3. **POST /collections/:id/objects**: Para criar um novo objeto em uma coleção, a rota espera um objeto JSON no corpo da requisição com a seguinte estrutura:
   ```json
   {
     "campoTexto": "valor1",
     "campoNumero": 12,
     "campoBooleano": true,
     "campoAnulavel": null, //require: false
     "campoObjectId": "64af9fa3f79a52d24ba2423c"
     ...
   }
   ```

4. **POST /collections/:id/objects/search**: Ao realizar uma busca em uma coleção com base em filtros, a rota requer um objeto JSON no corpo da requisição com a seguinte estrutura:
   ```json
   {
    "filters": [
      {
        "key": "nome_do_campo",
        "equals": "valor_igual", //aceita qualquer tipo de variável
        "notEquals": "valor_diferente", //aceita qualquer tipo de variável
        "regex": "expressao_regular",
        "caseInsensitive": true,
        "gt": 10,
        "gte": 5,
        "lt": 100,
        "lte": 50,
        "in": ["a", "b", "c"], // aceita qualquer tipo de variável dentro do array
        "notIn": ["a", "b", "c"] // aceita qualquer tipo de variável dentro do array
      },
      ...
    ],
    "sort": {
      "key": "nome_do_campo",
      "direction": "asc" // ["asc", "desc"]
    },
    "pagination": {
      "page": 0,
      "itemsPerPage": 10
    }
   }
   ```
   O campo `filters` contém uma matriz de objetos de filtro, onde cada objeto pode ter as seguintes propriedades: `key` (nome do campo), `equals` (valor igual), `notEquals` (valor diferente), `regex` (expressão regular), `caseInsensitive` (correspondência sem distinção entre maiúsculas e minúsculas), `gt` (maior que), `gte` (maior ou igual a), `lt` (menor que) e `lte` (menor ou igual a).
   
   **IMPORTANTE**: Ao passa um valor na propriedade `equals` do filtro, todas as outras propriedades serão ignoradas.

5. **PUT /collections/:cid/objects/:id**: Para atualizar um objeto existente em uma coleção, a rota espera um objeto JSON no corpo da requisição com os campos e valores a serem atualizados. O formato do objeto varia de acordo com os campos e valores específicos que você deseja atualizar.

```json
   {
     "campoTexto": "valor1",
     "campoNumero": 12,
     "campoBooleano": true,
     "campoAnulavel": null, //require: false
     "campoObjectId": "64af9fa3f79a52d24ba2423c"
     ...
   }
   ```

Essas são as entradas de dados esperadas para cada rota da Dynamic Database API. Certifique-se de fornecer os dados corretos no formato adequado ao fazer as requisições.  

## Exemplo do Retorno das Rotas

  

Aqui estão alguns exemplos de retornos para as rotas da Dynamic Database API:

  

1.  **GET /collections**: Retorna todas as coleções existentes.

Exemplo de retorno:

```json
[
  {
    "_id": "60ed2461465c1e1234567890",
    "name": "clientes",
    "fields": [
      {
        "key": "nome",
        "type": "string",
        "required": true,
        "trim": true
      },
      {
        "key": "idade",
        "type": "number",
        "required": false,
        "trim": false
      }
    ]
  },
  {
    "_id": "60ed2461465c1e1234567891",
    "name": "produtos",
    "fields": [
      {
        "key": "nome",
        "type": "string",
        "required": true,
        "trim": true
      },
      {
        "key": "preco",
        "type": "number",
        "required": true,
        "trim": false
      }
    ]
  }
]

```

Nesse exemplo, são retornadas duas coleções existentes com seus respectivos campos.

  

2.  **POST /collections**: Cria uma nova coleção.

Exemplo de retorno:

```json
{
  "_id": "60ed2461465c1e1234567892",
  "name": "pedidos",
  "fields": []
}

```

Nesse exemplo, uma nova coleção chamada "pedidos" é criada.
 

3.  **POST /collections/:id/fields**: Adiciona um novo campo à coleção especificada pelo ID.

Exemplo de retorno:

```json
{
  "_id": "60ed2461465c1e1234567890",
  "name": "clientes",
  "fields": [
    {
      "key": "nome",
      "type": "string",
      "required": true,
      "trim": true
    },
    {
      "key": "idade",
      "type": "number",
      "required": false,
      "trim": false
    },
    {
      "key": "email",
      "type": "string",
      "required": true,
      "trim": true
    }
  ]
}

```

Nesse exemplo, um novo campo chamado "email" é adicionado à coleção de "clientes".

  

4.  **POST /collections/:id/objects**: Cria um novo objeto na coleção especificada pelo ID.

Exemplo de retorno:

```json
{
  "_id": "60ed2461465c1e1234567893",
  "collectionId": "60ed2461465c1e1234567890",
  "nome": "João",
  "idade": 25
}
```

Nesse exemplo, um novo objeto é criado na coleção "clientes" com os campos "nome" e "idade".

  

5.  **POST /collections/:id/objects/search**: Realiza uma busca na coleção especificada pelos filtros fornecidos.

Exemplo de retorno:

```json
{
  "items": [
    {
      "_id": "60ed2461465c1e1234567893",
      "collectionId": "60ed2461465c1e1234567890",
      "nome": "João",
      "idade": 25
    },
    {
      "_id": "60ed2461465c1e1234567894",
      "collectionId": "60ed2461465c1e1234567890",
      "nome": "Maria",
      "idade": 30
    }
  ],
  "totalItems": 2,
  "page": 0,
  "itemsPerPage": 10,
  "pages": 1
}
```

Nesse exemplo, uma busca foi realizada na coleção "clientes" com base nos filtros fornecidos, retornando os objetos que correspondem aos critérios de busca.

  

6.  **GET /collections/:cid/objects/:id**: Retorna um objeto específico da coleção especificada pelo ID da coleção e do objeto.

Exemplo de retorno:

```json
{
  "_id": "60ed2461465c1e1234567893",
  "collectionId": "60ed2461465c1e1234567890",
  "nome": "João",
  "idade": 25
}
```

Nesse exemplo, é retornado o objeto com o ID "60ed2461465c1e1234567893" da coleção "clientes".

  

Esses exemplos ilustram os possíveis retornos para cada rota da Dynamic Database API. Os dados retornados podem variar de acordo com as entradas e a configuração específica da aplicação.

  

## Interfaces

A aplicação utiliza as seguintes interfaces:

  

```typescript
import { ObjectId } from  'mongodb';

export interface ICollectionField {
  key: string;
  type: string; // ["string", "number", "boolean", "objectId"]
  required: boolean;
  trim: boolean;
  ref: ObjectId;
}

export interface ICollection {
  name: string;
  fields: ICollectionField[];
}

export interface ICollectionObject {
  collectionId: ObjectId;
  [key: string]: any;
}

export interface ICollectionObjectFilter {
  key: string;
  equals: any;
  notEquals: any;
  regex: string; // string field
  caseInsensitive: boolean; // string field only
  gt: number; // number field only
  gte: number; // number field only
  lt: number; // number field only
  lte: number; // number field only
  in: any[];
  notIn: any[];
}

export interface ICollectionObjectSort {
  key: string
  direction: string
}

export interface ICollectionObjectsOutput {
  items: any[]
  pages: number
  page: number
  itemsPerPage: number
  totalItems: number
}
```

## Licença

Este projeto é Open Source, então sinta-se a vontade para usar da maneira que achar melhor :)

## Contato

Se você tiver alguma dúvida ou sugestão sobre este projeto, sinta-se à vontade para entrar em contato comigo pelo email [ricardosouza_defn@outlook.com](mailto:ricardosouza_defn@outlook.com).

Espero que este README tenha fornecido todas as informações necessárias para entender e utilizar a Dynamic Database API. Se houver algo mais que você gostaria de adicionar, por favor, avise-me.

[https://www.linkedin.com/in/ricardosouzaexe/](https://www.linkedin.com/in/ricardosouzaexe/)
