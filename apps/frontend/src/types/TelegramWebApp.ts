export interface WebAppUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string 
}

export interface WebAppInitData {
    query_id?: string;
    user: WebAppUser;
    auth_date: number;
    hash: string
    signature: string;
}