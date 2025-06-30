# 💼 Sistema de Gestão de Salas de Reunião

Este projeto é uma aplicação web simples para gerenciamento de salas de reunião e geração de códigos de acesso para convidados.

---

## 🎯 Objetivo

Permitir:
- Criação, listagem e exclusão de salas.
- Geração e exclusão de códigos de acesso (com apelido opcional).
- Validação de acesso via código.
- Interface web funcional e responsiva.

---

## 🚀 Tecnologias Utilizadas

| Camada     | Tecnologia              |
|------------|--------------------------|
| Backend    | Python + Flask           |
| Frontend   | HTML + CSS + JavaScript |
| Banco de Dados | SQLite via SQLAlchemy |

---

## ⚙️ Funcionalidades

### 🗂️ Gestão de Salas
- ✅ Criar uma nova sala com nome único
- ✅ Listar todas as salas
- ✅ Excluir uma sala (remove também os códigos vinculados)

### 🧑‍🤝‍🧑 Gestão de Códigos
- ✅ Gerar código único (UUID)
- ✅ Definir apelido opcional (sem duplicação na mesma sala)
- ✅ Listar códigos de uma sala
- ✅ Limite de 4 códigos por sala
- ✅ Excluir um código

### 🔐 Acesso à Sala
- ✅ Validar entrada com nome da sala e código
- ✅ Mensagem de erro/sucesso apropriada

### 🎁 Bônus
- ✅ Interface web responsiva

---

## 🧪 Como Executar

1. **Instale os requisitos:**

```bash
pip install -r requirements.txt
