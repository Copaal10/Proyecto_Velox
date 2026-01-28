// ==========================================
// CONFIGURACIÓN DE LA API
// ==========================================
const API_CONFIG = {
  baseURL: 'http://localhost:8080',
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register'
    },
    productos: {
      listar: '/productos',
      disponibles: '/productos/disponibles',
      crear: '/productos/crear',
      editar: (id) => `/productos/editar/${id}`,
      eliminar: (id) => `/productos/eliminar/${id}`
    },
    pedidos: {
      crear: '/pedidos/crear',
      usuario: (id) => `/pedidos/usuario/${id}`,
      estado: (estado) => `/pedidos/estado/${estado}`
    },
    usuarios: {
      obtener: (id) => `/usuarios/${id}`,
      email: (email) => `/usuarios/email/${email}`
    }
  }
};

// ==========================================
// FUNCIONES HELPER PARA LLAMADAS API
// ==========================================

// Obtener token del localStorage
function getToken() {
  return localStorage.getItem('velox-token');
}

// Guardar token y datos de usuario
function setAuthData(token, usuario) {
  localStorage.setItem('velox-token', token);
  localStorage.setItem('velox-usuario', JSON.stringify(usuario));
}

// Limpiar datos de autenticación
function clearAuthData() {
  localStorage.removeItem('velox-token');
  localStorage.removeItem('velox-usuario');
}

// Obtener usuario actual
function getCurrentUser() {
  const userData = localStorage.getItem('velox-usuario');
  return userData ? JSON.parse(userData) : null;
}

// Verificar si está autenticado
function isAuthenticated() {
  return !!getToken();
}

// Función genérica para hacer peticiones
async function apiCall(endpoint, options = {}) {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };

  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, config);

    // Si el token expiró
    if (response.status === 401) {
      clearAuthData();
      window.location.href = 'html/login.html';
      throw new Error('Sesión expirada');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('Error en API:', error);
    throw error;
  }
}

console.log("✅ api.js cargado correctamente");