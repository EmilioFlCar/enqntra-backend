import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private client: SupabaseClient;

    constructor() {
        this.client = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );
    }

    getClient(): SupabaseClient {
        return this.client;
    }

    async getUser(token: string) {
        const { data, error } = await this.client.auth.getUser(token);
        if (error) return null;
        return data.user;
    }
}
