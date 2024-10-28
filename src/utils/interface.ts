
export interface UserData {
    id: any;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    isEmailVerified: boolean;
    isPhoneNumberVerified: boolean;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}