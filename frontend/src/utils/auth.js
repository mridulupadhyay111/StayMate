export const saveAuth = (token, user) => {
  localStorage.setItem('staymate_token', token);
  localStorage.setItem('staymate_user', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('staymate_token');
  localStorage.removeItem('staymate_user');
  window.location.href = '/';
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('staymate_user');
  return user ? JSON.parse(user) : null;
};
