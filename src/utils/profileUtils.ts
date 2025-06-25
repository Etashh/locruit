
export const generateInitials = (firstName: string, lastName: string): string => {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
};

export const generateInitialsAvatar = (firstName: string, lastName: string): string => {
  const initials = generateInitials(firstName, lastName);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = 120;
  canvas.height = 120;
  
  if (context) {
    // Create gradient background
    const gradient = context.createLinearGradient(0, 0, 120, 120);
    gradient.addColorStop(0, '#3b82f6'); // blue-500
    gradient.addColorStop(1, '#10b981'); // green-500
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 120, 120);
    
    // Add initials text
    context.fillStyle = 'white';
    context.font = 'bold 48px Inter, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(initials, 60, 60);
  }
  
  return canvas.toDataURL();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{2,30}$/;
  return nameRegex.test(name.trim());
};

export const validateCertification = (certification: string): boolean => {
  return certification.trim().length >= 3 && certification.trim().length <= 300;
};
