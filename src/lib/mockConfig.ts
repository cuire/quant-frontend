// Configuration for mock data usage
export const mockConfig = {
  // Enable/disable mock data for different features
  useMockActivity: true,
  useMockGifts: false,
  useMockChannels: false,
  useMockUser: false,
  
  // Mock data settings
  mockDelay: {
    activity: 300,
    gifts: 500,
    channels: 300,
    user: 200
  },
  
  // Enable/disable mock data globally
  enableMocks: true
};

// Helper function to check if mocks should be used
export const shouldUseMock = (feature: keyof typeof mockConfig): boolean => {
  if (!mockConfig.enableMocks) return false;
  
  switch (feature) {
    case 'useMockActivity':
      return mockConfig.useMockActivity;
    case 'useMockGifts':
      return mockConfig.useMockGifts;
    case 'useMockChannels':
      return mockConfig.useMockChannels;
    case 'useMockUser':
      return mockConfig.useMockUser;
    default:
      return false;
  }
};

