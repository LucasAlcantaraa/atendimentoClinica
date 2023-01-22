const Sequelize = require('sequelize');

const { formatarResultados } = require('../utils/easy');
const fmt = require('../utils/formatacao');

exports.exeRawQuery = async (sql, config) => {
  const db = new Sequelize(config);
  await db.query(sql);
  await db.close();
}

exports.exeQuery = async (sql, config) => {
  const db = new Sequelize(config);
  const [results, metadata] = await db.query(sql);
  if (!results.length)
    throw new EmptyResultError();

  const newResults = formatarResultados(results);

  await db.close();
  return newResults;
};

exports.createTables = async (config) => {
  const sequelize = new Sequelize(config);
  try {

    const Usuarios = sequelize.define('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      login: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      senha: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });

    await Usuarios.sync();

    const Clientes = sequelize.define('clientes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      telefone: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
      },

    },
    {
      createdAt:false,
      updatedAt:false
    });

    await Clientes.sync();

    const UserFuncionarios = sequelize.define('userfuncionarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      login: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      senha: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });

    await UserFuncionarios.sync();

    const Funcionarios = sequelize.define('funcionarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'userfuncionarios',
          key: 'id'
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      telefone: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
      },

    },{
      createdAt:false,
      updatedAt:false
    });

    await Funcionarios.sync();

    const Servicos = sequelize.define('servicos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      valor: {
        type: Sequelize.FLOAT,
        unique: false,
        allowNull: false
      },
      tempoexecucao: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: false
      },
      descricao: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
      },
      googleicon: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
      }

    },
    {
      createdAt:false,
      updatedAt:false
    });

    await Servicos.sync();

    const Atendimentos = sequelize.define('atendimentos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      data: {
        type: Sequelize.DATE,
        allowNull: false
      },
      funcionario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'funcionarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'clientes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      servico_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'servicos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    },{
      createdAt:false,
      updatedAt:false
    });

    await Atendimentos.sync();

    Atendimentos.belongsToMany(Servicos, { through: 'atendimento_servicos' });
    Servicos.belongsToMany(Atendimentos, { through: 'atendimento_servicos' });
    Atendimentos.belongsTo(Funcionarios);
    Funcionarios.hasMany(Atendimentos);
    Atendimentos.belongsTo(Clientes);
    Clientes.hasMany(Atendimentos);
    UserFuncionarios.hasMany(Funcionarios);
    Funcionarios.belongsTo(UserFuncionarios);
    Usuarios.hasMany(Clientes);
    Clientes.belongsTo(Usuarios);
    sequelize.sync({ force: false });


    console.log('Tabelas criadas com sucesso.');

  } catch {
    console.log('Não foi possível criar as tabelas');
  } 

};

exports.getData = (dialeto, data = null, entre = '-', hora = false) => {
  if (dialeto === 'MSSQL') {
    return fmt.dataMesPrimeiro(data, entre, hora);
  } else {
    return fmt.dataFormatadaInvertida(data, entre, hora);
  }
};
