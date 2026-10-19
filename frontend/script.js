/**
 * LabControl — Minimalist & Professional Frontend Controller
 * Consumo da API REST em http://localhost:8080/equipamentos
 */

const API_BASE_URL = 'http://localhost:8080/equipamentos';

// Cache de dados para busca/filtro local
let listaEquipamentos = [];

// Elementos DOM
const form = document.getElementById('equipamento-form');
const formTitle = document.getElementById('form-title');
const formDesc = document.getElementById('form-desc');
const inputId = document.getElementById('equipamento-id');
const inputNome = document.getElementById('nome');
const inputPatrimonio = document.getElementById('numeroPatrimonio');
const inputCategoria = document.getElementById('categoria');
const inputQuantidade = document.getElementById('quantidade');
const btnSubmit = document.getElementById('btn-submit');
const btnSubmitText = document.getElementById('btn-submit-text');
const btnCancel = document.getElementById('btn-cancel');

const tabelaCorpo = document.getElementById('tabela-corpo');
const filtroBusca = document.getElementById('filtro-busca');
const statModelos = document.getElementById('stat-modelos');
const statItens = document.getElementById('stat-itens');
const toastContainer = document.getElementById('toast-container');

// ========================================================
// Toast Notifications
// ========================================================
function showToast(type, title, message) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconText = type === 'success' ? '✓' : '!';

  toast.innerHTML = `
    <div class="toast-icon">${iconText}</div>
    <div class="toast-body">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button type="button" class="toast-close" aria-label="Fechar">&times;</button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.remove();
  });

  toastContainer.appendChild(toast);

  // Auto-remover após 6 segundos (para erro) ou 3.5 segundos (para sucesso)
  const duration = type === 'error' ? 6000 : 3500;
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }
  }, duration);
}

// ========================================================
// Consumo da API (GET - Listar)
// ========================================================
async function carregarEquipamentos() {
  tabelaCorpo.innerHTML = `
    <tr>
      <td colspan="6" class="cell-loading">Carregando registros...</td>
    </tr>
  `;

  try {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.mensagem || `Falha na requisição: status ${response.status}`);
    }

    listaEquipamentos = await response.json();
    atualizarStats();
    renderizarTabela(obterEquipamentosFiltrados());
  } catch (error) {
    tabelaCorpo.innerHTML = `
      <tr>
        <td colspan="6" class="cell-empty" style="color: var(--accent-danger);">
          Não foi possível conectar à API LabControl.<br>
          <small style="color: var(--text-muted);">Certifique-se de que a aplicação Spring Boot está rodando em http://localhost:8080</small>
        </td>
      </tr>
    `;
    statModelos.textContent = '0';
    statItens.textContent = '0';
    showToast('error', 'Erro de Conexão', error.message);
  }
}

function atualizarStats() {
  statModelos.textContent = listaEquipamentos.length;
  const totalItens = listaEquipamentos.reduce((acc, curr) => acc + (Number(curr.quantidade) || 0), 0);
  statItens.textContent = totalItens;
}

function obterEquipamentosFiltrados() {
  const termo = (filtroBusca.value || '').trim().toLowerCase();
  if (!termo) return listaEquipamentos;

  return listaEquipamentos.filter(item => 
    (item.nome && item.nome.toLowerCase().includes(termo)) ||
    (item.numeroPatrimonio && item.numeroPatrimonio.toLowerCase().includes(termo)) ||
    (item.categoria && item.categoria.toLowerCase().includes(termo))
  );
}

filtroBusca.addEventListener('input', () => {
  renderizarTabela(obterEquipamentosFiltrados());
});

function renderizarTabela(dados) {
  if (dados.length === 0) {
    const msg = listaEquipamentos.length === 0
      ? 'Nenhum equipamento cadastrado até o momento.'
      : 'Nenhum equipamento corresponde ao filtro de busca.';
    tabelaCorpo.innerHTML = `
      <tr>
        <td colspan="6" class="cell-empty">${msg}</td>
      </tr>
    `;
    return;
  }

  tabelaCorpo.innerHTML = dados.map(item => `
    <tr id="row-${item.id}">
      <td class="item-id">#${item.id}</td>
      <td><strong>${escapeHtml(item.nome)}</strong></td>
      <td><span class="badge-patrimonio">${escapeHtml(item.numeroPatrimonio)}</span></td>
      <td><span class="badge-categoria">${escapeHtml(item.categoria)}</span></td>
      <td style="text-align: center;">
        <span class="badge-qty ${item.quantidade === 0 ? 'zero' : ''}">${item.quantidade}</span>
      </td>
      <td>
        <div class="action-buttons">
          <button type="button" class="btn-table btn-table-edit" onclick="iniciarEdicao(${item.id})">
            Editar
          </button>
          <button type="button" class="btn-table btn-table-delete" onclick="confirmarExclusao(${item.id})">
            Excluir
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ========================================================
// Formulário (POST / PUT)
// ========================================================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = inputId.value;
  const isEditing = Boolean(id);

  const payload = {
    nome: inputNome.value.trim(),
    numeroPatrimonio: inputPatrimonio.value.trim(),
    categoria: inputCategoria.value.trim(),
    quantidade: parseInt(inputQuantidade.value, 10)
  };

  const url = isEditing ? `${API_BASE_URL}/${id}` : API_BASE_URL;
  const method = isEditing ? 'PUT' : 'POST';

  btnSubmit.disabled = true;
  btnSubmitText.textContent = isEditing ? 'Atualizando...' : 'Salvando...';

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (response.status === 201) {
      showToast('success', 'Equipamento Cadastrado', `"${data.nome}" foi registrado com sucesso.`);
      resetarFormulario();
      carregarEquipamentos();
    } else if (response.status === 200) {
      showToast('success', 'Equipamento Atualizado', `Os dados do item #${data.id} foram salvos.`);
      resetarFormulario();
      carregarEquipamentos();
    } else if (response.status === 400) {
      // Mensagem de validação
      const msg = data && data.mensagem ? data.mensagem : 'Dados inválidos. Verifique os campos informados.';
      showToast('error', 'Dados Inválidos (400)', msg);
    } else if (response.status === 409) {
      // Mensagem de duplicidade de patrimônio
      const msg = data && data.mensagem ? data.mensagem : 'Patrimônio já cadastrado em outro equipamento.';
      showToast('error', 'Conflito de Patrimônio (409)', msg);
    } else if (response.status === 404) {
      const msg = data && data.mensagem ? data.mensagem : 'Equipamento não encontrado.';
      showToast('error', 'Não Encontrado (404)', msg);
    } else {
      const msg = data && data.mensagem ? data.mensagem : `Erro inesperado (Status: ${response.status}).`;
      showToast('error', `Erro ${response.status}`, msg);
    }
  } catch (error) {
    showToast('error', 'Falha na Requisição', `Erro ao contatar o servidor: ${error.message}`);
  } finally {
    btnSubmit.disabled = false;
    btnSubmitText.textContent = inputId.value ? 'Salvar Alterações' : 'Cadastrar Equipamento';
  }
});

// ========================================================
// Edição
// ========================================================
window.iniciarEdicao = function(id) {
  const item = listaEquipamentos.find(e => e.id === id);
  if (!item) return;

  inputId.value = item.id;
  inputNome.value = item.nome;
  inputPatrimonio.value = item.numeroPatrimonio;
  inputCategoria.value = item.categoria;
  inputQuantidade.value = item.quantidade;

  formTitle.textContent = 'Editar Equipamento';
  formDesc.textContent = `Atualizando registro de patrimônio #${item.id}.`;
  btnSubmitText.textContent = 'Salvar Alterações';
  btnCancel.classList.remove('hidden');

  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  inputNome.focus();
};

btnCancel.addEventListener('click', () => {
  resetarFormulario();
});

function resetarFormulario() {
  form.reset();
  inputId.value = '';
  formTitle.textContent = 'Novo Equipamento';
  formDesc.textContent = 'Preencha os dados abaixo para cadastrar um item.';
  btnSubmitText.textContent = 'Cadastrar Equipamento';
  btnCancel.classList.add('hidden');
}

// ========================================================
// Exclusão (DELETE)
// ========================================================
window.confirmarExclusao = async function(id) {
  const item = listaEquipamentos.find(e => e.id === id);
  const identificador = item ? `"${item.nome}" (Patrimônio: ${item.numeroPatrimonio})` : `ID #${id}`;

  const confirmado = window.confirm(`Deseja realmente excluir ${identificador}? Essa ação é definitiva.`);
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      showToast('success', 'Registro Excluído', `Equipamento #${id} removido do sistema.`);
      if (inputId.value === String(id)) {
        resetarFormulario();
      }
      carregarEquipamentos();
    } else if (response.status === 404) {
      const data = await response.json().catch(() => ({}));
      showToast('error', 'Registro Não Encontrado (404)', data.mensagem || 'O item já não existe no banco.');
      carregarEquipamentos();
    } else {
      const data = await response.json().catch(() => ({}));
      showToast('error', `Erro ${response.status}`, data.mensagem || 'Não foi possível excluir o registro.');
    }
  } catch (error) {
    showToast('error', 'Erro de Conexão', `Falha ao tentar excluir: ${error.message}`);
  }
};

// ========================================================
// Utilitários de Segurança
// ========================================================
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  carregarEquipamentos();
});
