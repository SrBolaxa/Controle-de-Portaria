import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
import re
import eel

# Inicializa a pasta "web" como base para os arquivos HTML/CSS/JS
eel.init('web')

# Inicia o aplicativo
eel.start('index.html', size=(800, 600))  # Define o tamanho da janela


# Lista de registros
registros = []

# Função para validar CPF
def validar_cpf(cpf):
    cpf = re.sub(r'\D', '', cpf)  # Remove caracteres não numéricos
    if len(cpf) != 11 or cpf == cpf[0] * len(cpf):  # Verifica comprimento e repetições
        return False
    for i in range(9, 11):
        soma = sum(int(cpf[num]) * (i + 1 - num) for num in range(i))
        digito = (soma * 10) % 11
        if digito == 10:
            digito = 0
        if digito != int(cpf[i]):
            return False
    return True

# Função para registrar entrada
def registrar_entrada():
    tipo = tipo_var.get()
    cpf = cpf_entry.get()
    nome = nome_entry.get()
    motivo = motivo_entry.get() if motivo_entry.get() else "N/A"

    if not validar_cpf(cpf):
        messagebox.showerror("Erro", "CPF inválido! Entrada não registrada.")
        return

    horario_entrada = datetime.now().strftime('%d/%m/%Y %H:%M:%S')

    if tipo == "Funcionário":
        motivo = "Trabalha aqui"
    elif tipo == "Morador":
        motivo = "Morador"

    registro = {
        'tipo': tipo,
        'cpf': cpf,
        'nome': nome,
        'motivo': motivo,
        'horario_entrada': horario_entrada,
        'horario_saida': None
    }
    registros.append(registro)
    atualizar_tabela()
    messagebox.showinfo("Sucesso", "Entrada registrada com sucesso!")
    limpar_campos()

# Função para registrar saída
def registrar_saida(cpf):
    for registro in registros:
        if registro['cpf'] == cpf and registro['horario_saida'] is None:
            registro['horario_saida'] = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
            atualizar_tabela()
            messagebox.showinfo("Sucesso", "Saída registrada com sucesso!")
            return
    messagebox.showerror("Erro", "Registro não encontrado ou saída já registrada!")

# Função para atualizar a tabela
def atualizar_tabela():
    for row in tabela.get_children():
        tabela.delete(row)
    for registro in registros:
        tabela.insert('', 'end', values=(
            registro['tipo'],
            registro['cpf'],
            registro['nome'],
            registro['motivo'],
            registro['horario_entrada'],
            registro['horario_saida'] if registro['horario_saida'] else "---"
        ))

# Função para limpar campos
def limpar_campos():
    tipo_var.set("Funcionário")
    cpf_entry.delete(0, tk.END)
    nome_entry.delete(0, tk.END)
    motivo_entry.delete(0, tk.END)
    motivo_label.grid_remove()
    motivo_entry.grid_remove()

# Interface gráfica com Tkinter
app = tk.Tk()
app.title("Controle de Portaria")

# Campos de entrada
frame = ttk.Frame(app, padding=10)
frame.grid(row=0, column=0, sticky=(tk.W, tk.E))

ttk.Label(frame, text="Tipo:").grid(row=0, column=0, sticky=tk.W)
tipo_var = tk.StringVar(value="Funcionário")
tipo_menu = ttk.Combobox(frame, textvariable=tipo_var, values=["Funcionário", "Morador", "Visitante", "Prestador"], state="readonly")
tipo_menu.grid(row=0, column=1, sticky=(tk.W, tk.E))

ttk.Label(frame, text="CPF:").grid(row=1, column=0, sticky=tk.W)
cpf_entry = ttk.Entry(frame, width=30)
cpf_entry.grid(row=1, column=1, sticky=(tk.W, tk.E))

ttk.Label(frame, text="Nome:").grid(row=2, column=0, sticky=tk.W)
nome_entry = ttk.Entry(frame, width=30)
nome_entry.grid(row=2, column=1, sticky=(tk.W, tk.E))

motivo_label = ttk.Label(frame, text="Motivo da entrada:")
motivo_label.grid(row=3, column=0, sticky=tk.W)
motivo_entry = ttk.Entry(frame, width=30)
motivo_entry.grid(row=3, column=1, sticky=(tk.W, tk.E))
motivo_label.grid_remove()
motivo_entry.grid_remove()

# Mostrar/ocultar motivo
def atualizar_campos(*args):
    if tipo_var.get() in ["Visitante", "Prestador"]:
        motivo_label.grid()
        motivo_entry.grid()
    else:
        motivo_label.grid_remove()
        motivo_entry.grid_remove()

tipo_var.trace("w", atualizar_campos)

# Botões
ttk.Button(frame, text="Registrar Entrada", command=registrar_entrada).grid(row=4, column=0, columnspan=2, sticky=(tk.W, tk.E))

# Tabela de registros
tabela = ttk.Treeview(app, columns=("Tipo", "CPF", "Nome", "Motivo", "Entrada", "Saída"), show="headings")
tabela.grid(row=1, column=0, sticky=(tk.W, tk.E))
for col in tabela["columns"]:
    tabela.heading(col, text=col)
    tabela.column(col, anchor=tk.W, width=100)

# Botão para registrar saída
def acao_saida():
    item_selecionado = tabela.selection()
    if item_selecionado:
        cpf = tabela.item(item_selecionado, "values")[1]
        registrar_saida(cpf)
    else:
        messagebox.showwarning("Aviso", "Selecione um registro para registrar a saída!")

ttk.Button(app, text="Registrar Saída", command=acao_saida).grid(row=2, column=0, sticky=(tk.W, tk.E))

# Iniciar o aplicativo
app.mainloop()
