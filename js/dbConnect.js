// dbConnect.js
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://lqjnebezvdehhbnpjthu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxam5lYmV6dmRlaGhibnBqdGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTAzMjUsImV4cCI6MjA5NzY4NjMyNX0.qwGXyWzdq8IKqCd0QP8rfOQAt44UfNf1tYs9DuTr100";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// State management for user
export const authState = {
  user: null,
  async init() {
    const { data } = await supabase.auth.getUser();
    this.user = data.user;
    return this.user;
  }
};
