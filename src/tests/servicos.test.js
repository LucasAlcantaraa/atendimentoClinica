// const {insertServicos} = require('../routes/login')
const servicos = require('../services/servicos')


test('verifica se itens foram inseridos', () => {
    //const servicos = [{ id: 1, name: 'Servico 1' }, { id: 2, name: 'Servico 2' }];
    const spy = jest.spyOn(console, 'log');
    insertServicos(servicos);
    expect(spy).toHaveBeenCalledWith([{
        nome: 'Nefrologista',
        descricao: 'Especialidade médica que se ocupa do diagnóstico e tratamento clínico das doenças do sistema urinário, em especial o rim..',
        googleicon: 'nephrology',
        valor: '35,00',
        tempoexecucao: '20'
    },
    {
        nome: 'Vacinação',
        descricao: 'Uma preparação biológica que fornece imunidade adquirida ativa para uma doença particular.',
        googleicon: 'vaccines',
        valor: '20,00',
        tempoexecucao: '5'
    },
    {
        nome: 'Exame de Sangue',
        descricao: 'Exames laboratoriais realizados no sangue para adquirir informações sobre doenças e funções dos órgãos',
        googleicon: 'labs',
        valor: '15,00',
        tempoexecucao: '10'
    
    }]);
    spy.mockRestore();
  });
  
  function insertServicos(servicos){
   console.log(servicos)
}