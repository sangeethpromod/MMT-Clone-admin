const apiEndpoints = {
  // Auth-related endpoints
  auth: {
    login: "/api/auth/login",
    refresh: "/api/auth/refresh",
    sendOtp: "/api/auth/request-password-reset",
    resetPassword: "/api/auth/reset-password",
  },

  // Host Related Endpoints
  host: {
    hostListApproval: "/api/admin/hosts",
    approveHost: "/api/admin/hosts/approve",
    rejectHost: "/api/admin/hosts/reject",
    unblockHost: "/api/admin/hosts/unblock",
    blockHost: "/api/admin/hosts/block",
    deleteHost: "/api/admin/hosts/delete",
    hostDetails: "/api/admin/hosts/:id",
  },

  // Traveller Related Endpoints
  traveller: {
    travellerList: "/api/admin/travellers",
    travellerDetails: "/api/admin/travellers/:id",
  },
  // Story Related Endpoints
  story: {
    storyList: "/api/admin/stories",
    storyDetails: "/api/admin/stories/:id",
    approveStory: "/api/admin/stories/create-story/:id/approve",
    rejectStory: "/api/admin/stories/reject",
    blockStory: "/api/admin/stories/block",
  },

  fee: {
    createFees: "/api/fees",
    feeList: "/api/fees/get-all-fees",
    feeDetails: (id: string) => `/api/fees/${id}`,
    deleteFee: (id: string) => `/api/fees/${id}`,
    updateFee: (id: string) => `/api/fees/update/${id}`,
  },

    // Transactions Related Endpoints
  transactions: {
    transactionList: "/api/admin/transaction-table-data",
    transactionDetails: "/api/admin/transaction-details/:razorpayOrderId",
  },
};

export { apiEndpoints };
