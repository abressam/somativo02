// Usa o banco de dados somativo02
use("somativo02")

// O banco de dados é criado após adicionar uma coleção

// Enum das siglas dos estados
const estadosBrasil = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

// 2. Inserção e Validação:
// Criação do collection dos usuários
db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "email", "senha", "endereco"],
      properties: {
        nome: { bsonType: "string", description: "Nome do usuário", minLength: 3, maxLength: 100},
        email: { bsonType: "string", description: "Email do usuário", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" },
        senha: { bsonType: "string", description: "Senha do usuário", minLength: 8 },
        endereco: {
          bsonType: "object",
          required: ["rua", "cidade", "estado", "cep"],
          properties: {
            rua: { bsonType: "string", description: "Rua do endereço" },
            cidade: { bsonType: "string", description: "Cidade do endereço" },
            estado: { bsonType: "string", description: "Estado do endereço, formato: XX", enum: estadosBrasil },
            cep: { bsonType: "string", description: "CEP do endereço, formato: XXXXXXXX", minLength: 8 }
          }
        }
      }
    }
  }
});

// Criação do collection dos produtos
db.createCollection("produtos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "descricao", "preco", "quantidade_disponivel", "categoria_id"],
      properties: {
        nome: { bsonType: "string", description: "Nome do produto", minLength: 3, maxLength: 150 },
        descricao: { bsonType: "string", description: "Descrição do produto", minLength: 3, maxLength: 250 },
        preco: { bsonType: "decimal", description: "Preço do produto", pattern: "^\d+(\.\d{1,2})?$" },
        quantidade_disponivel: { bsonType: "int", description: "Quantidade disponível em estoque", minimum: 0 },
        categoria_id: { bsonType: "objectId", description: "ID da categoria do produto" }
      }
    }
  }
});

// Criação do collection de transações
db.createCollection("transacoes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["usuario_id", "produto_id", "data", "quantidade", "valor_total"],
      properties: {
        usuario_id: { bsonType: "objectId", description: "ID do usuário que fez a compra" },
        produto_id: { bsonType: "objectId", description: "ID do produto comprado" },
        data: { bsonType: "date", description: "Data da transação" },
        quantidade: { bsonType: "int", description: "Quantidade do produto comprado", minimum: 1 },
        valor_total: { bsonType: "decimal", description: "Valor total da transação", pattern: "^\d+(\.\d{1,2})?$" }
      }
    }
  }
});

// Criação do collection de avaliações
db.createCollection("avaliacoes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["produto_id", "usuario_id", "nota", "comentario", "data"],
      properties: {
        produto_id: { bsonType: "objectId", description: "ID do produto avaliado" },
        usuario_id: { bsonType: "objectId", description: "ID do usuário que avaliou" },
        nota: { bsonType: "int", description: "Nota dada pelo usuário deve ser de 1 a 5", minimum: 1, maximum: 5 },
        comentario: { bsonType: "string", description: "Comentário da avaliação", maxLength: 250 },
        data: { bsonType: "date", description: "Data da avaliação" }
      }
    }
  }
});

// Criação do collection de categorias
db.createCollection("categorias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "subcategorias"],
      properties: {
        nome: { bsonType: "string", description: "Nome da categoria" },
        subcategorias: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["nome", "descricao"],
            properties: {
              nome: { bsonType: "string", description: "Nome da subcategoria", minLength: 3, maxLength: 150 },
              descricao: { bsonType: "string", description: "Descrição da subcategoria", minLength: 3, maxLength: 250 }
            }
          }
        }
      }
    }
  }
});
  
// Inserção dos usuários na collection usuarios
db.usuarios.insertMany([
  {
    nome: "Maria Silva",
    email: "maria@example.com",
    senha: "Maria123@",
    endereco: { rua: "Rua A", cidade: "São Paulo", estado: "SP", cep: "01000000" }
  },
  {
    nome: "João Santos",
    email: "joao@example.com",
    senha: "Joao123@",
    endereco: { rua: "Rua B", cidade: "Rio de Janeiro", estado: "RJ", cep: "20000000" }
  },
  {
    nome: "Ana Pereira",
    email: "ana@example.com",
    senha: "Ana1456@",
    endereco: { rua: "Rua C", cidade: "Curitiba", estado: "PR", cep: "80000000" }
  },
  {
    nome: "Carlos Oliveira",
    email: "carlos@example.com",
    senha: "Carlos789@",
    endereco: { rua: "Rua D", cidade: "Porto Alegre", estado: "RS", cep: "90000000" }
  },
  {
    nome: "Fernanda Souza",
    email: "fernanda@example.com",
    senha: "Fernanda123@",
    endereco: { rua: "Rua E", cidade: "Belo Horizonte", estado: "MG", cep: "30000000" }
  }
]);

// Inserção das categorias na collection categorias
db.categorias.insertMany([
  {
    nome: "Eletrônicos",
    subcategorias: [
      { nome: "Celulares", descricao: "Aparelhos de telefone móvel" },
      { nome: "Tablets", descricao: "Dispositivos de leitura e multimídia" }
    ]
  },
  {
    nome: "Informática",
    subcategorias: [
      { nome: "Notebooks", descricao: "Computadores portáteis" },
      { nome: "Desktops", descricao: "Computadores de mesa" }
    ]
  },
  {
    nome: "Acessórios",
    subcategorias: [
      { nome: "Fones de Ouvido", descricao: "Acessórios de áudio" },
      { nome: "Relógios Inteligentes", descricao: "Relógios com funcionalidades digitais" }
    ]
  },
  {
    nome: "Eletrodomésticos",
    subcategorias: [
      { nome: "Geladeiras", descricao: "Eletrodomésticos para refrigeração" },
      { nome: "Máquinas de Lavar", descricao: "Eletrodomésticos para lavar roupas" }
    ]
  },
  {
    nome: "Móveis",
    subcategorias: [
      { nome: "Sofás", descricao: "Assentos confortáveis para sala" },
      { nome: "Mesas", descricao: "Mesas de jantar e trabalho" }
    ]
  }
]);

// 3. Consultas:
// Seleciona todos os documentos na collection categorias
db.categorias.find()
  
// Inserção dos produtos na collection produtos
db.produtos.insertMany([
  {
    nome: "Celular",
    descricao: "Smartphone de última geração",
    preco: NumberDecimal("1500.00"),
    quantidade_disponivel: 10,
    categoria_id: ObjectId("672d55df5c7964ebca7727ab")
  },
  {
    nome: "Notebook",
    descricao: "Notebook para trabalho",
    preco: NumberDecimal("2500.00"),
    quantidade_disponivel: 5,
    categoria_id: ObjectId("672d55df5c7964ebca7727ac")
  },
  {
    nome: "Tablet",
    descricao: "Tablet para leitura e multimídia",
    preco: NumberDecimal("800.00"),
    quantidade_disponivel: 8,
    categoria_id: ObjectId("672d55df5c7964ebca7727ab")
  },
  {
    nome: "Fone de Ouvido",
    descricao: "Fone de ouvido Bluetooth",
    preco: NumberDecimal("200.00"),
    quantidade_disponivel: 15,
    categoria_id: ObjectId( "672d55df5c7964ebca7727ad")
  },
  {
    nome: "Smartwatch",
    descricao: "Relógio inteligente com monitoramento de atividades",
    preco: NumberDecimal("500.00"),
    quantidade_disponivel: 12,
    categoria_id: ObjectId( "672d55df5c7964ebca7727ad")
  }
]);
  
// Seleciona todos os documentos na collection produtos, correspondentes ao id da categoria informado
db.produtos.find({ categoria_id: ObjectId("672d55df5c7964ebca7727ad") });

// Seleciona todos os documentos na collection produtos
db.produtos.find()

// Seleciona todos os documentos na collection avaliacoes, correspondentes ao id do produto informado
db.avaliacoes.find({ produto_id: ObjectId("672d55f85c7964ebca7727b4") });

// Seleciona todos os documentos na collection usuarios
db.usuarios.find()

// Inserção de uma única transação
db.transacoes.insertOne({
  usuario_id: ObjectId("672d55cf5c7964ebca7727a6"),
  produto_id: ObjectId( "672d5b11a9dc7621ef47bb55"),
  data: new Date(),
  quantidade: 1,
  valor_total: NumberDecimal("1500.00")
});

// Alteração de um produto - decrementar 1
db.produtos.updateOne(
  { _id: ObjectId("672d5b11a9dc7621ef47bb55") },
  { $inc: { quantidade_disponivel: -1 } }
);

// 4. Índices:
// O campo email é um identificador único para os usuários, e é comum que sistemas busquem usuários por e-mail (por exemplo, durante o login ou recuperação de conta).
db.usuarios.createIndex({ email: 1 });

// O campo categoria_id é usado para associar produtos a categorias específicas. Como é esperado que os usuários filtrem produtos por categoria (por exemplo, ao procurar por todos os produtos de "Eletrônicos" ou "Móveis"), o índice facilita essas buscas. 
db.produtos.createIndex({ categoria_id: 1 });

// Cada avaliação está associada a um produto específico, e é comum que as avaliações de um produto sejam listadas na sua página. Esse índice permite que o MongoDB busque rapidamente todas as avaliações relacionadas a um determinado produto_id, tornando a busca por avaliações mais eficiente.
db.avaliacoes.createIndex({ produto_id: 1 });

// O índice composto nos campos usuario_id e data foi criado para facilitar a consulta das transações de um usuário específico, listando-as em ordem cronológica inversa (do mais recente ao mais antigo). Isso é útil, por exemplo, para mostrar o histórico de compras de um usuário, sendo mais eficiente retornar as transações recentes primeiro. 
db.transacoes.createIndex({ usuario_id: 1, data: -1 });

// 5. Agregações:
// Adicionando mais inserções de transação para realizar a agregação dos dados
db.transacoes.insertMany([
  {
    usuario_id: ObjectId("672d55cf5c7964ebca7727a9"),
    produto_id: ObjectId( "672d5b11a9dc7621ef47bb56"),
    data: new Date(),
    quantidade: 1,
    valor_total: NumberDecimal("2500.00")
  },
  {
    usuario_id: ObjectId("672d55cf5c7964ebca7727aa"),
    produto_id: ObjectId( "672d5b11a9dc7621ef47bb56"),
    data: new Date(),
    quantidade: 1,
    valor_total: NumberDecimal("2500.00")
  },
  {
    usuario_id: ObjectId("672d55cf5c7964ebca7727a7"),
    produto_id: ObjectId( "672d5b11a9dc7621ef47bb57"),
    data: new Date(),
    quantidade: 1,
    valor_total: NumberDecimal("800.00")
  },
  {
    usuario_id: ObjectId("672d55cf5c7964ebca7727a8"),
    produto_id: ObjectId( "672d5b11a9dc7621ef47bb59"),
    data: new Date(),
    quantidade: 1,
    valor_total: NumberDecimal("200.00")
  },
])

// Diminuindo a quantidade de produtos
db.produtos.updateOne(
  { _id: ObjectId("672d5b11a9dc7621ef47bb56") },
  { $inc: { quantidade_disponivel: -2 } }
);

db.produtos.updateOne(
  { _id: ObjectId("672d5b11a9dc7621ef47bb57") },
  { $inc: { quantidade_disponivel: -1 } }
);

db.produtos.updateOne(
  { _id: ObjectId("672d5b11a9dc7621ef47bb59") },
  { $inc: { quantidade_disponivel: -1 } }
);

// Inserindo avaliações dos produtos
db.avaliacoes.insertMany([
  {
    produto_id: ObjectId("672d55f85c7964ebca7727b3"),
    usuario_id: ObjectId("672d55cf5c7964ebca7727a6"),
    nota: 5,
    comentario: "Excelente produto, recomendo!",
    data: new Date("2024-11-07")
  },
  {
    produto_id: ObjectId("672d5b11a9dc7621ef47bb56"),
    usuario_id: ObjectId("672d55cf5c7964ebca7727a9"),
    nota: 3,
    comentario: "Serve para coisas básicas, mas nada demais",
    data: new Date("2024-11-07")
  },
  {
    produto_id: ObjectId("672d5b11a9dc7621ef47bb56"),
    usuario_id: ObjectId("672d55cf5c7964ebca7727aa"),
    nota: 5,
    comentario: "Adorei o produto! Super recomendo!",
    data: new Date("2024-11-07")
  },
  {
    produto_id: ObjectId("672d5b11a9dc7621ef47bb57"),
    usuario_id: ObjectId("672d55cf5c7964ebca7727a7"),
    nota: 1,
    comentario: "Produto com avaria, péssimo!",
    data: new Date("2024-11-07")
  },
  {
    produto_id: ObjectId("672d5b11a9dc7621ef47bb59"),
    usuario_id: ObjectId("672d55cf5c7964ebca7727a8"),
    nota: 4,
    comentario: "Não tinha a cor que eu queria, mas é ótimo!",
    data: new Date("2024-11-07")
  }
]);

// Agregação para encontrar a média de avaliações para cada produto
db.avaliacoes.aggregate([
  {
    $group: {
      _id: "$produto_id",  // Agrupar por produto_id
      media_avaliacao: { $avg: "$nota" }  // Calcular a média da nota
    }
  },
  {
    $lookup: {
      from: "produtos",  // Realizar uma junção com a coleção de produtos
      localField: "_id",  // Campo de junção (produto_id da avaliação)
      foreignField: "_id",  // Campo correspondente na coleção de produtos
      as: "produto_info"  // Nome do campo de resultado da junção
    }
  },
  {
    $unwind: "$produto_info"  // Desembrulha o array de produto_info
  },
  {
    $project: {
      produto_id: "$_id",  // Mostra o id do produto
      nome_produto: "$produto_info.nome",  // Inclui o nome do produto
      media_avaliacao: 1  // Inclui a média da avaliação
    }
  }
]);

// Agregação para encontrar o total de vendas para cada categoria
db.transacoes.aggregate([
  {
    $lookup: {
      from: "produtos",               // Coleção de produtos
      localField: "produto_id",       // Campo que conecta a transação ao produto
      foreignField: "_id",            // Campo que conecta o produto à transação
      as: "produto_info"              // Alias para armazenar os dados do produto
    }
  },
  {
    $unwind: "$produto_info"          // Desfaz o array de produtos para acessar as propriedades
  },
  {
    $lookup: {
      from: "categorias",             // Coleção de categorias
      localField: "produto_info.categoria_id",  // Campo de categoria no produto
      foreignField: "_id",            // Campo _id da categoria
      as: "categoria_info"            // Alias para armazenar as informações da categoria
    }
  },
  {
    $unwind: "$categoria_info"        // Desfaz o array de categorias
  },
  {
    $group: {
      _id: "$categoria_info.nome",    // Agrupa por nome da categoria
      total_vendas: {                 // Soma o valor total das transações por categoria
        $sum: "$valor_total"
      }
    }
  },
  {
    $project: {                        // Projeção para garantir a categoria
      _id: 0,
      categoria: "$_id",
      total_vendas: 1
    }
  },
  {
    $sort: { "total_vendas": -1 }      // Ordena os resultados por total de vendas, do maior para o menor
  }
]);



// SPRINT 2 =================================================================================================

// 6. Promoções

//adicionando "promocao" em produtos
db.runCommand({
    collMod: "produtos",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["nome", "descricao", "preco", "quantidade_disponivel", "categoria_id"],
            properties: {
                nome: { bsonType: "string", description: "Nome do produto", minLength: 3, maxLength: 150 },
                descricao: { bsonType: "string", description: "Descrição do produto", minLength: 3, maxLength: 250 },
                preco: { bsonType: "decimal", description: "Preço do produto", pattern: "^\d+(\.\d{1,2})?$" },
                quantidade_disponivel: { bsonType: "int", description: "Quantidade disponível em estoque", minimum: 0 },
                categoria_id: { bsonType: "objectId", description: "ID da categoria do produto" },
                promocao: {
                    bsonType: "object",
                    description: "Detalhes da promoção do produto",
                    properties: {
                        desconto: { bsonType: "int", description: "Percentual de desconto", minimum: 0, maximum: 100 },
                        inicio: { bsonType: "date", description: "Data de início da promoção" },
                        fim: { bsonType: "date", description: "Data de término da promoção" }
                    }
                }
            }
        }
    }
});

//adicionando promoção a um produto
db.produtos.updateOne(
    { _id: ObjectId("ID_DO_PRODUTO") },
    {
        $set: {
            "promocao.desconto": 20,  // neste caso 20% de desconto
            "promocao.inicio": new Date("2024-11-01"),
            "promocao.fim": new Date("2024-12-01")
        }
    }
);

//consultar promoção hoje
const hoje = new Date();
db.produtos.find({
    "promocao.desconto": { $gt: 0 },
    "promocao.inicio": { $lte: hoje },
    "promocao.fim": { $gte: hoje }
});


// 7. Pontos de fidelidade

//adicionando "pontos" em usuários 
db.runCommand({
    collMod: "usuarios",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["nome", "email", "senha", "endereco"],
            properties: {
                nome: { bsonType: "string", description: "Nome do usuário", minLength: 3, maxLength: 100 },
                email: { bsonType: "string", description: "Email do usuário", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" },
                senha: { bsonType: "string", description: "Senha do usuário", minLength: 8 },
                endereco: {
                    bsonType: "object",
                    required: ["rua", "cidade", "estado", "cep"],
                    properties: {
                        rua: { bsonType: "string", description: "Rua do endereço" },
                        cidade: { bsonType: "string", description: "Cidade do endereço" },
                        estado: { bsonType: "string", description: "Estado do endereço, formato: XX", enum: estadosBrasil },
                        cep: { bsonType: "string", description: "CEP do endereço, formato: XXXXXXXX", minLength: 8 }
                    }
                },
                pontos: { bsonType: "int", description: "Pontos de fidelidade do usuário" } // Nova propriedade adicionada
            }
        }
    }
});

//adicionando "pontos_fidelidade" em transação (para cada compra)
db.runCommand({
    collMod: "transacoes",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["usuario_id", "produto_id", "data", "quantidade", "valor_total"],
            properties: {
                usuario_id: { bsonType: "objectId", description: "ID do usuário que fez a compra" },
                produto_id: { bsonType: "objectId", description: "ID do produto comprado" },
                data: { bsonType: "date", description: "Data da transação" },
                quantidade: { bsonType: "int", description: "Quantidade do produto comprado", minimum: 1 },
                valor_total: { bsonType: "decimal", description: "Valor total da transação", pattern: "^\d+(\.\d{1,2})?$" },
                pontos_fidelidade: { bsonType: "int", description: "Pontos de fidelidade dados ao usuário por esta compra", minimum: 0 }
            }
        }
    }
});

//no nosso caso, o usuário pode usar os pontos como desconto nesse caso de 100 em 100, aqui subtraimos dele 
db.usuarios.updateOne(
    { _id: ObjectId("ID_DO_USUARIO"), pontos: { $gte: 100 } }, // gte é greater than or equal
    { $inc: { pontos: -100 } } //inc para incrementar, nesse caso subtrair
);


// 8. Resposta a Avaliações

//adicionando "resposta" em avaliacoes
db.runCommand({
    collMod: "avaliacoes",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["produto_id", "usuario_id", "nota", "comentario", "data"],
            properties: {
                produto_id: { bsonType: "objectId", description: "ID do produto avaliado" },
                usuario_id: { bsonType: "objectId", description: "ID do usuário que avaliou" },
                nota: { bsonType: "int", description: "Nota dada pelo usuário deve ser de 1 a 5", minimum: 1, maximum: 5 },
                comentario: { bsonType: "string", description: "Comentário da avaliação", maxLength: 250 },
                data: { bsonType: "date", description: "Data da avaliação" },
                resposta: {
                    bsonType: "object",
                    description: "Resposta do vendedor à avaliação",
                    properties: {
                        mensagem: { bsonType: "string", description: "Resposta do vendedor", maxLength: 250 },
                        data_resposta: { bsonType: "date", description: "Data da resposta" }
                    }
                }
            }
        }
    }
});

//comando para adicionar (update o campo) resposta a avaliação
db.avaliacoes.updateOne(
    { _id: ObjectId("ID_DA_AVALIACAO") },
    {
        $set: {
            "resposta.mensagem": "Obrigado pelo feedback!",
            "resposta.data_resposta": new Date()
        }
    }
);

// 9. Geolocalização

// 9.1 Atualizando usuário para que possa definir sua localização geográfica.
db.runCommand({
  collMod: "usuarios",
  validator: {
      $jsonSchema: {
          bsonType: "object",
          required: ["nome", "email", "senha", "endereco"],
          properties: {
              nome: { bsonType: "string", description: "Nome do usuário", minLength: 3, maxLength: 100 },
              email: { bsonType: "string", description: "Email do usuário", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" },
              senha: { bsonType: "string", description: "Senha do usuário", minLength: 8 },
              endereco: {
                  bsonType: "object",
                  required: ["rua", "cidade", "estado", "cep"],
                  properties: {
                      rua: { bsonType: "string", description: "Rua do endereço" },
                      cidade: { bsonType: "string", description: "Cidade do endereço" },
                      estado: { bsonType: "string", description: "Estado do endereço, formato: XX", enum: estadosBrasil },
                      cep: { bsonType: "string", description: "CEP do endereço, formato: XXXXXXXX", minLength: 8 }
                  }
              },
              pontos: { bsonType: "int", description: "Pontos de fidelidade do usuário" }, 
              localizacao: {  // Adicionando o campo 'localizacao' para ponto geográfico
                bsonType: "object",
                description: "Localização geográfica do usuário",
                required: ["type", "coordinates"],
                properties: {
                    type: { bsonType: "string", enum: ["Point"], description: "Tipo de geometria, deve ser 'Point'" },
                    coordinates: { 
                        bsonType: "array", 
                        minItems: 2, 
                        maxItems: 2, 
                        items: { bsonType: "double" },
                        description: "Coordenadas geográficas (longitude, latitude)"
                    }
                }
            }
        }
      }
    }
});

// criação do índice geoespacial do MongoDB para poder realizar busca por proximidade
db.usuarios.createIndex({ "localizacao": "2dsphere" });

// exemplo de inserção de usuário com localização
db.usuarios.insertOne({
  nome: "João Silva",
  email: "joao.silva@email.com",
  senha: "senha1234",
  endereco: {
      rua: "Rua A",
      cidade: "São Paulo",
      estado: "SP",
      cep: "12345678"
  },
  pontos: 150,
  localizacao: {
      type: "Point",
      coordinates: [-46.633309, -23.550520]  // Longitude, Latitude
  }
});

// testando a localização do usuário
db.usuarios.find({
  localizacao: {
      $near: {
          $geometry: { type: "Point", coordinates: [-46.63, -23.55] }, // Coordenadas de exemplo, não precisa ser o número inteiro para localizar
          $maxDistance: 10000 // Distância máxima em metros
      }
  }
});

// 9.2 Atualizando produto com a localização do vendedor associado a ele
db.runCommand({
  collMod: "produtos",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "descricao", "preco", "quantidade_disponivel", "categoria_id", "localizacao"], 
      properties: {
        nome: { bsonType: "string", description: "Nome do produto", minLength: 3, maxLength: 150 },
        descricao: { bsonType: "string", description: "Descrição do produto", minLength: 3, maxLength: 250 },
        preco: { bsonType: "decimal", description: "Preço do produto", pattern: "^\d+(\.\d{1,2})?$" },
        quantidade_disponivel: { bsonType: "int", description: "Quantidade disponível em estoque", minimum: 0 },
        categoria_id: { bsonType: "objectId", description: "ID da categoria do produto" },
        localizacao: {  
          bsonType: "object",
          description: "Localização geográfica do vendedor",
          required: ["type", "coordinates"],
          properties: {
            type: { bsonType: "string", enum: ["Point"], description: "Tipo de geometria, deve ser 'Point'" },
            coordinates: {
              bsonType: "array",
              minItems: 2,
              maxItems: 2,
              items: { bsonType: "double" },
              description: "Coordenadas geográficas (longitude, latitude)"
            }
          }
        }
      }
    }
  }
});


// criacao do indice geoespacial para produtos
db.produtos.createIndex({ "localizacao": "2dsphere" });

// inserindo um produto com localização
db.produtos.insertOne({
  nome: "Smartphone XYZ",
  descricao: "Smartphone com 6GB de RAM e 128GB de armazenamento",
  preco:  NumberDecimal("1999.99"),
  quantidade_disponivel: 50,
  categoria_id: ObjectId("672d55df5c7964ebca7727ab"),
  localizacao: {
    type: "Point",
    coordinates: [-46.633309, -23.550520] 
  }
});

// buscando o produto com localIzação
db.produtos.find({
  localizacao: {
    $near: {
      $geometry: { type: "Point", coordinates: [-46.633309, -23.550520] },
      $maxDistance: 10000
    }
  }
});

// Os usuários podem buscar produtos com base na proximidade geográfica, podendo filtrar os resultados por raio de distância.

let usuarioId = ObjectId("ID_DO_USUARIO"); // Substituir com a ID do usuário que vai buscar um produto próximo

// Recuperando as coordenadas do usuário a partir do ID
let usuario = db.usuarios.findOne({ _id: usuarioId });
let coordenadasUsuario = usuario.localizacao.coordinates;  // Coordenadas do usuário

// Raio de busca em metros
let raioBusca = 10000;

// Consulta para encontrar produtos próximos à localização do usuário
db.produtos.find({
  localizacao: {
    $near: {
      $geometry: { type: "Point", coordinates: coordenadasUsuario },
      $maxDistance: raioBusca
    }
  }
});

// 9.4 Escreva uma consulta de agregação para encontrar a média de distância entre compradores e vendedores para transações concluídas.

// insetindo 3 usuários com localização geográfica aleatória (dentro de 10 km) para fazer o teste
db.usuarios.insertMany([
  {
    nome: "João Silva",
    email: "joao.silva@email.com",
    senha: "senha1234",
    endereco: {
      rua: "Rua A",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000"
    },
    pontos: 150,
    localizacao: {
      type: "Point",
      coordinates: [-46.625, -23.548]  // Coordenadas aleatórias próximas a São Paulo
    }
  },
  {
    nome: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    senha: "senha1234",
    endereco: {
      rua: "Rua B",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01001-000"
    },
    pontos: 200,
    localizacao: {
      type: "Point",
      coordinates: [-46.630, -23.555]  // Coordenadas aleatórias próximas a São Paulo
    }
  },
  {
    nome: "Carlos Pereira",
    email: "carlos.pereira@email.com",
    senha: "senha1234",
    endereco: {
      rua: "Rua C",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01002-000"
    },
    pontos: 100,
    localizacao: {
      type: "Point",
      coordinates: [-46.635, -23.560]  // Coordenadas aleatórias próximas a São Paulo
    }
  }
]);
