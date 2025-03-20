const form = document.getElementById('formEntrada');
const tabelaRegistros = document.getElementById('tabelaRegistros').querySelector('tbody');
const tipoSelect = document.getElementById('tipo');
const informacoesAdicionaisVisitantes = document.getElementById('informacoesAdicionaisVisitantes');
const btnEntrada = document.getElementById('btnEntrada');

// Função para salvar registros no LocalStorage
function salvarRegistrosLocalStorage(registros) {
    localStorage.setItem('registrosPortaria', JSON.stringify(registros));
}

// Função para carregar registros do LocalStorage
function carregarRegistrosLocalStorage() {
    return JSON.parse(localStorage.getItem('registrosPortaria')) || [];
}

// Função para renderizar os registros na tabela
function renderizarRegistros() {
    const registros = carregarRegistrosLocalStorage();
    tabelaRegistros.innerHTML = ''; // Limpa a tabela antes de renderizar novamente
    registros.forEach((registro) => {
        const linha = document.createElement('tr');
        linha.setAttribute('data-cpf', registro.cpf);
        linha.innerHTML = `
            <td>${registro.tipo}</td>
            <td>${registro.cpf}</td>
            <td>${registro.nome}</td>
            <td>${registro.motivo}</td>
            <td>${new Date(registro.horarioEntrada).toLocaleString()}</td>
            <td>${registro.horarioSaida ? new Date(registro.horarioSaida).toLocaleString() : '---'}</td>
            <td><button class="btn-saida" data-cpf="${registro.cpf}">Registrar Saída</button></td>
        `;
        tabelaRegistros.appendChild(linha);

        // Adicionar evento ao botão de saída
        const btnSaida = linha.querySelector('.btn-saida');
        btnSaida.addEventListener('click', () => registrarSaida(registro.cpf));
    });
}

// Mostrar ou ocultar campos adicionais
tipoSelect.addEventListener('change', () => {
    if (tipoSelect.value === 'visitante' || tipoSelect.value === 'prestador') {
        informacoesAdicionaisVisitantes.style.display = 'block';
    } else {
        informacoesAdicionaisVisitantes.style.display = 'none';
    }
});

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf[9])) {
        return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf[10])) {
        return false;
    }

    return true; // CPF válido
}

// Função para registrar a entrada
btnEntrada.addEventListener('click', () => {
    const tipo = tipoSelect.value;
    const cpf = document.getElementById('cpf').value;
    const nome = document.getElementById('nome').value;
    let motivo = document.getElementById('motivo').value || 'N/A';
    const horarioEntrada = new Date().toISOString();

    if (!validarCPF(cpf)) {
        alert('CPF inválido! Entrada não registrada.');
        return;
    }

    // Definir motivos específicos para funcionário e morador
    if (tipo === 'funcionario') {
        motivo = "Trabalha aqui";
    } else if (tipo === 'morador') {
        motivo = "Morador";
    }

    const registros = carregarRegistrosLocalStorage();

    // Verificar se o CPF já está registrado
    const existente = registros.find((r) => r.cpf === cpf);
    if (existente) {
        alert('Entrada já registrada para esse CPF!');
        return;
    }

    const novoRegistro = {
        tipo,
        cpf,
        nome,
        motivo,
        horarioEntrada,
        horarioSaida: null,
    };

    registros.push(novoRegistro);
    salvarRegistrosLocalStorage(registros);
    renderizarRegistros();

    alert('Entrada registrada com sucesso!');
    form.reset();
    informacoesAdicionaisVisitantes.style.display = 'none';
});

// Função para registrar a saída
function registrarSaida(cpf) {
    const registros = carregarRegistrosLocalStorage();
    const registro = registros.find((r) => r.cpf === cpf);

    if (registro && !registro.horarioSaida) {
        registro.horarioSaida = new Date().toISOString();
        salvarRegistrosLocalStorage(registros);
        renderizarRegistros();
        alert('Saída registrada com sucesso!');
    } else {
        alert('Erro: Registro não encontrado ou saída já registrada.');
    }
}

// Renderizar registros ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderizarRegistros();
});
