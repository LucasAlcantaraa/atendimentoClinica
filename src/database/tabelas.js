// const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
//   host: process.env.HOST,
//   dialect: 'postgres',
// });


// // SESSÃO DESIGNADA PARA REALIZAR A CRIAÇÃO DAS TABELAS NO BANCO DE DADOS
// const Usuarios = sequelize.define('usuarios', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     allowNull: false,
//     autoIncrement: true
//   },
//   login: {
//     type: Sequelize.STRING,
//     unique: true,
//     allowNull: false
//   },
//   senha: {
//     type: Sequelize.STRING,
//     unique: true,
//     allowNull: false
//   },
//   createdAt: {
//     type: Sequelize.DATE,
//     defaultValue: Sequelize.literal('NOW()')
//   },
//   updatedAt: {
//     type: Sequelize.DATE,
//     defaultValue: Sequelize.literal('NOW()')
//   }
// });

// const Clientes = sequelize.define('clientes', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     allowNull: false,
//     autoIncrement: true
//   },
//   nome: {
//     type: Sequelize.STRING,
//     unique: false,
//     allowNull: false
//   },
//   user_id: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'usuarios',
//       key: 'id'
//     },

//     onUpdate: 'CASCADE',
//     onDelete: 'CASCADE'
//   },
//   telefone: {
//     type: Sequelize.STRING,
//     unique: false,
//     allowNull: false
//   },

// });

// const UserFuncionarios = sequelize.define('userfuncionarios', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     allowNull: false,
//     autoIncrement: true
//   },
//   login: {
//     type: Sequelize.STRING,
//     unique: true,
//     allowNull: false
//   },
//   senha: {
//     type: Sequelize.STRING,
//     unique: true,
//     allowNull: false
//   },
//   createdAt: {
//     type: Sequelize.DATE,
//     defaultValue: Sequelize.literal('NOW()')
//   },
//   updatedAt: {
//     type: Sequelize.DATE,
//     defaultValue: Sequelize.literal('NOW()')
//   }
// });


// const Funcionarios = sequelize.define('funcionarios', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     allowNull: false,
//     autoIncrement: true
//   },
//   nome: {
//     type: Sequelize.STRING,
//     unique: false,
//     allowNull: false
//   },
//   user_id: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'userfuncionarios',
//       key: 'id'
//     },

//     onUpdate: 'CASCADE',
//     onDelete: 'CASCADE'
//   },
//   telefone: {
//     type: Sequelize.STRING,
//     unique: false,
//     allowNull: false
//   },

// });

// const Servicos = sequelize.define('servicos', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     allowNull: false,
//     autoIncrement: true
//   },
//   nome: {
//     type: Sequelize.STRING,
//     unique: true,
//     allowNull: false
//   },
//   valor: {
//     type: Sequelize.FLOAT,
//     unique: false,
//     allowNull: false
//   },
//   tempoexecucao: {
//     type: Sequelize.INTEGER,
//     unique: false,
//     allowNull: false
//   }

// });

// const Atendimentos = sequelize.define('atendimentos', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   date: {
//     type: Sequelize.DATE,
//     allowNull: false
//   },
//   funcionario_id: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'funcionarios',
//       key: 'id'
//     },
//     onUpdate: 'CASCADE',
//     onDelete: 'CASCADE'
//   },
//   cliente_id: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'clientes',
//       key: 'id'
//     },
//     onUpdate: 'CASCADE',
//     onDelete: 'CASCADE'
//   },
//   servico_id: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'servicos',
//       key: 'id'
//     },
//     onUpdate: 'CASCADE',
//     onDelete: 'CASCADE'
//   }
// });

// Atendimentos.belongsToMany(Servicos, { through: 'atendimento_servicos' });
// Servicos.belongsToMany(Atendimentos, { through: 'atendimento_servicos' });

// Atendimentos.belongsTo(Funcionarios);
// Funcionarios.hasMany(Atendimentos);

// Atendimentos.belongsTo(Clientes);
// Clientes.hasMany(Atendimentos);

// UserFuncionarios.hasMany(Funcionarios);
// Funcionarios.belongsTo(UserFuncionarios);

// Usuarios.hasMany(Clientes);
// Clientes.belongsTo(Usuarios);


// sequelize.sync({ force: true });

// // console.log(`Tentando conexão com o banco...`)


// sequelize.authenticate()
//   .then(() => {
//     console.log(`Banco de dados Postgres conectado com sucesso!`);
//   })
//   .catch((err)=>{
//     console.log("Não foi possível conectar com o banco de dados!");
//     console.log(err);
//   });


// module.exports = sequelize;
// module.exports = { Usuarios };
// module.exports = { Clientes };
// module.exports = { Funcionarios };
// module.exports = { UserFuncionarios };
// module.exports = { Servicos };
