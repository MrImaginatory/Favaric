export const StatusMessages = {
    // Common
    SUCCESS: "Operation completed successfully.",
    INTERNAL_SERVER_ERROR: "An unexpected error occurred. Please try again later.",
    BAD_REQUEST: "The request could not be understood or was invalid.",
    NOT_FOUND: "The requested resource was not found.",
    VALIDATION_ERROR: "One or more validation errors occurred.",
    ALREADY_EXISTS: "Record already exists.",
    CREATED: "Record created successfully.",
    UPDATED: "Record updated successfully.",

    // Authentication & Authorization
    AUTH_SUCCESS: "Authentication successful.",
    AUTH_FAILED: "Invalid email or password.",
    UNAUTHORIZED: "Access denied. Please login to continue.",
    FORBIDDEN: "Access denied. You do not have permission to perform this action.",
    TOKEN_EXPIRED: "Session expired. Please login again.",
    ACCOUNT_LOCKED: "Account has been locked due to multiple failed attempts.",

    // User / Profile
    USER_CREATED: "User registered successfully.",
    USER_UPDATED: "User profile updated successfully.",
    USER_LOGGED_IN: "User logged in successfully.",
    USER_ALREADY_EXISTS: "An account with this email already exists.",
    USER_NOT_FOUND: "User not found.",
    USER_EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
    USER_USERNAME_ALREADY_EXISTS: "An account with this username already exists.",


    // Database
    DATABASE_ERROR: "A database error occurred while processing your request.",
    CONNECTION_SUCCESS: "Database connection established successfully.",
    CONNECTION_FAILED: "Unable to connect to the database.",

    // E-commerce Specific (Future use)
    PRODUCT_NOT_FOUND: "Product not found.",
    OUT_OF_STOCK: "This item is currently out of stock.",
    ORDER_CREATED: "Order placed successfully.",
    PAYMENT_SUCCESS: "Payment processed successfully.",
    PAYMENT_FAILED: "Payment processing failed.",

};

export default StatusMessages;