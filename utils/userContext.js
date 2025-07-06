// Simple user context for managing user identification
export const getCurrentUser = () => {
  // For now, return a default user
  // In a real app, this would come from authentication
  return {
    id: "aakarshshrey12@gmail.com",
    email: "aakarshshrey12@gmail.com",
    name: "User"
  };
};

export const getUserId = () => {
  return getCurrentUser().id;
}; 