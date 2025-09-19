/**
 * FurkAI Todo Module
 * Görev ve takvim yönetimi modülü
 */

class TodoModule {
  constructor() {
    this.name = 'todo';
    this.todos = [];
    this.categories = ['Kişisel', 'İş', 'Sağlık', 'Eğitim', 'Ev İşleri'];
    this.priorities = ['Düşük', 'Orta', 'Yüksek', 'Acil'];
  }

  async init() {
    await this.loadTodos();
    this.setupEventListeners();
  }

  async loadTodos() {
    try {
      this.todos = await window.DataManager.getData('todos') || [];
    } catch (error) {
      console.error('Görevler yüklenemedi:', error);
      this.todos = [];
    }
  }

  async saveTodos() {
    try {
      await window.DataManager.saveData('todos', this.todos);
    } catch (error) {
      console.error('Görevler kaydedilemedi:', error);
    }
  }

  setupEventListeners() {
    // Bu modül yüklendiğinde çalışacak olaylar
    window.EventSystem.on(window.FurkAIEvents.MODULE_LOADED, (moduleName) => {
      if (moduleName === this.name) {
        this.render();
      }
    });
  }

  render() {
    const content = document.getElementById('page-content');
    if (!content) {
      console.error('page-content elementi bulunamadı, Todo modülü render edilemiyor');
      return;
    }

    try {
      content.innerHTML = `
      <div class="module-header">
        <h2>Görevler & Takvim</h2>
        <button class="btn btn-primary" onclick="window.TodoModule?.showAddTodoModal()">
          <span class="icon">+</span>
          Yeni Görev
        </button>
      </div>

      <div class="todo-stats">
        <div class="stat-card">
          <div class="stat-number">${this.getCompletedCount()}</div>
          <div class="stat-label">Tamamlanan</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${this.getPendingCount()}</div>
          <div class="stat-label">Bekleyen</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${this.getOverdueCount()}</div>
          <div class="stat-label">Geciken</div>
        </div>
      </div>

      <div class="todo-filters">
        <button class="filter-btn active" data-filter="all">Tümü</button>
        <button class="filter-btn" data-filter="pending">Bekleyen</button>
        <button class="filter-btn" data-filter="completed">Tamamlanan</button>
        <button class="filter-btn" data-filter="overdue">Geciken</button>
      </div>

      <div class="todo-list" id="todo-list">
        ${this.renderTodoList()}
      </div>

      <!-- Add Todo Modal -->
      <div id="add-todo-modal" class="modal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Yeni Görev</h3>
            <button class="modal-close" onclick="window.TodoModule?.hideAddTodoModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="add-todo-form">
              <div class="input-group">
                <label for="todo-title">Görev Başlığı</label>
                <input type="text" id="todo-title" required>
              </div>
              
              <div class="input-group">
                <label for="todo-description">Açıklama</label>
                <textarea id="todo-description" rows="3"></textarea>
              </div>
              
              <div class="input-group">
                <label for="todo-category">Kategori</label>
                <select id="todo-category">
                  ${this.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
              </div>
              
              <div class="input-group">
                <label for="todo-priority">Öncelik</label>
                <select id="todo-priority">
                  ${this.priorities.map((priority, index) => 
                    `<option value="${index}">${priority}</option>`
                  ).join('')}
                </select>
              </div>
              
              <div class="input-group">
                <label for="todo-due-date">Bitiş Tarihi</label>
                <input type="datetime-local" id="todo-due-date">
              </div>
              
              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="window.TodoModule?.hideAddTodoModal()">İptal</button>
                <button type="submit" class="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

      this.setupTodoEventListeners();
    } catch (error) {
      console.error('Todo modülü render hatası:', error);
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Todo Modülü Yüklenemedi</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  setupTodoEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        this.filterTodos(filter);
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Add todo form
    const form = document.getElementById('add-todo-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addTodo();
      });
    }
  }

  renderTodoList(filter = 'all') {
    let filteredTodos = this.todos;

    switch (filter) {
      case 'pending':
        filteredTodos = this.todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        filteredTodos = this.todos.filter(todo => todo.completed);
        break;
      case 'overdue':
        filteredTodos = this.todos.filter(todo => this.isOverdue(todo));
        break;
    }

    if (filteredTodos.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h3>Henüz görev yok</h3>
          <p>Yeni bir görev ekleyerek başlayın</p>
          <button class="btn btn-primary" onclick="window.TodoModule?.showAddTodoModal()">
            İlk Görevi Ekle
          </button>
        </div>
      `;
    }

    return filteredTodos.map(todo => this.renderTodoItem(todo)).join('');
  }

  renderTodoItem(todo) {
    const priorityColors = ['#4fc3f7', '#ff9800', '#f44336', '#9c27b0'];
    const priorityColor = priorityColors[todo.priority] || priorityColors[0];
    const isOverdue = this.isOverdue(todo);

    return `
      <div class="todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-id="${todo.id}">
        <div class="todo-checkbox">
          <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                 onchange="window.TodoModule?.toggleTodo('${todo.id}')">
        </div>
        
        <div class="todo-content">
          <div class="todo-header">
            <h4 class="todo-title">${todo.title}</h4>
            <div class="todo-priority" style="background-color: ${priorityColor}">
              ${this.priorities[todo.priority]}
            </div>
          </div>
          
          ${todo.description ? `<p class="todo-description">${todo.description}</p>` : ''}
          
          <div class="todo-meta">
            <span class="todo-category">${todo.category}</span>
            ${todo.dueDate ? `<span class="todo-due-date ${isOverdue ? 'overdue' : ''}">${this.formatDate(todo.dueDate)}</span>` : ''}
            <span class="todo-created">${this.formatDate(todo.createdAt)}</span>
          </div>
        </div>
        
        <div class="todo-actions">
          <button class="btn btn-icon" onclick="window.TodoModule?.editTodo('${todo.id}')" title="Düzenle">
            <span class="icon">✏️</span>
          </button>
          <button class="btn btn-icon" onclick="window.TodoModule?.deleteTodo('${todo.id}')" title="Sil">
            <span class="icon">🗑️</span>
          </button>
        </div>
      </div>
    `;
  }

  async addTodo() {
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;
    const category = document.getElementById('todo-category').value;
    const priority = parseInt(document.getElementById('todo-priority').value);
    const dueDate = document.getElementById('todo-due-date').value;

    const todo = {
      id: this.generateId(),
      title,
      description,
      category,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.todos.unshift(todo);
    await this.saveTodos();
    
    this.hideAddTodoModal();
    this.render();
    
    // Form'u temizle
    document.getElementById('add-todo-form').reset();
  }

  async toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = new Date().toISOString();
      await this.saveTodos();
      this.render();
    }
  }

  async deleteTodo(id) {
    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      this.todos = this.todos.filter(t => t.id !== id);
      await this.saveTodos();
      this.render();
    }
  }

  async editTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;

    // Form'u doldur
    document.getElementById('todo-title').value = todo.title;
    document.getElementById('todo-description').value = todo.description || '';
    document.getElementById('todo-category').value = todo.category;
    document.getElementById('todo-priority').value = todo.priority;
    document.getElementById('todo-due-date').value = todo.dueDate ? 
      new Date(todo.dueDate).toISOString().slice(0, 16) : '';

    this.showAddTodoModal();
    
    // Form submit'ini güncelle
    const form = document.getElementById('add-todo-form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      
      todo.title = document.getElementById('todo-title').value;
      todo.description = document.getElementById('todo-description').value;
      todo.category = document.getElementById('todo-category').value;
      todo.priority = parseInt(document.getElementById('todo-priority').value);
      todo.dueDate = document.getElementById('todo-due-date').value ? 
        new Date(document.getElementById('todo-due-date').value).toISOString() : null;
      todo.updatedAt = new Date().toISOString();

      await this.saveTodos();
      this.hideAddTodoModal();
      this.render();
      
      // Form'u temizle
      form.reset();
    };
  }

  filterTodos(filter) {
    const todoList = document.getElementById('todo-list');
    if (todoList) {
      todoList.innerHTML = this.renderTodoList(filter);
    }
  }

  showAddTodoModal() {
    const modal = document.getElementById('add-todo-modal');
    if (modal) {
      modal.style.display = 'flex';
      requestAnimationFrame(() => {
        modal.classList.add('show');
      });
    }
  }

  hideAddTodoModal() {
    const modal = document.getElementById('add-todo-modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  }

  getCompletedCount() {
    return this.todos.filter(todo => todo.completed).length;
  }

  getPendingCount() {
    return this.todos.filter(todo => !todo.completed).length;
  }

  getOverdueCount() {
    return this.todos.filter(todo => this.isOverdue(todo)).length;
  }

  isOverdue(todo) {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Yarın';
    if (diffDays === -1) return 'Dün';
    if (diffDays > 0) return `${diffDays} gün sonra`;
    if (diffDays < 0) return `${Math.abs(diffDays)} gün önce`;

    return date.toLocaleDateString('tr-TR');
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Global olarak erişilebilir yap
window.TodoModule = new TodoModule();