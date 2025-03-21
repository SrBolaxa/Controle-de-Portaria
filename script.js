// Função para registrar a entrada
btnEntrada.addEventListener('click', () => {
  const tipo = tipoSelect.value;
  const cpf = document.getElementById('cpf').value;
  const nome = document.getElementById('nome').value;
  const placaInput = document.getElementById('placa').value;
  const placa = placaInput.trim() === '' ? 'não veio de carro' : placaInput; // Define "não veio de carro" se o campo estiver vazio
  let motivo = document.getElementById('motivo').value || 'N/A';
  const horarioEntrada = new Date().toISOString();

  // Validação de CPF
  if (!validarCPF(cpf)) {
    alert('CPF inválido! Entrada não registrada.');
    return;
  }

  // Definir motivos específicos para funcionário e morador
  if (tipo === 'funcionario') {
    motivo = 'Trabalha aqui';
  } else if (tipo === 'morador') {
    motivo = 'Morador';
  }

  const linha = document.createElement('tr');
  linha.setAttribute('data-cpf', cpf); // Identificar a linha pelo CPF
  linha.innerHTML = `
    <td>${tipo}</td>
    <td>${cpf}</td>
    <td>${nome}</td>
    <td>${motivo}</td>
    <td>${placa}</td>
    <td>${new Date(horarioEntrada).toLocaleString()}</td>
    <td>---</td>
    <td><button class="btn-saida" data-cpf="${cpf}">Registrar Saída</button></td>
  `;
  tabelaRegistros.appendChild(linha);

  alert('Entrada registrada com sucesso!');
  form.reset();
  informacoesAdicionaisVisitantes.style.display = 'none';

  // Adicionar evento ao botão de saída
  const btnSaida = linha.querySelector('.btn-saida');
  btnSaida.addEventListener('click', () => registrarSaida(linha));
});
