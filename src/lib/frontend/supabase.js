import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project-id.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

const isMock = supabaseUrl.includes("your-project-id") || 
               supabaseAnonKey.includes("your-anon-key") || 
               supabaseUrl.includes("dummy.supabase.co") || 
               supabaseAnonKey.includes("dummykey");

let supabaseClient;

if (isMock) {
  let listeners = [];
  const triggerAuthChange = (event, session) => {
    listeners.forEach(cb => cb(event, session));
  };

  const getSessionFromStorage = () => {
    if (typeof window === "undefined") return null;
    const item = window.localStorage.getItem("mock-supabase-session");
    return item ? JSON.parse(item) : null;
  };

  const getRegisteredUsers = () => {
    if (typeof window === "undefined") return [];
    const users = window.localStorage.getItem("mock-registered-users");
    return users ? JSON.parse(users) : [];
  };

  const saveRegisteredUser = (user) => {
    if (typeof window === "undefined") return;
    const users = getRegisteredUsers();
    users.push(user);
    window.localStorage.setItem("mock-registered-users", JSON.stringify(users));
  };

  const DEFAULT_USERS = [
    {
      email: "nikita@socialpulse.dev",
      username: "nikita7011",
      password: "password123",
      fullName: "Nikita Gandhi"
    }
  ];

  supabaseClient = {
    auth: {
      getSession: async () => {
        const session = getSessionFromStorage();
        return { data: { session }, error: null };
      },
      getUser: async (token) => {
        if (token === "mock-token") {
          return { data: { user: { email: "mock-user@example.com" } }, error: null };
        }
        return { data: { user: null }, error: new Error("Invalid token") };
      },
      signInWithPassword: async ({ email, password }) => {
        const identifier = email.toLowerCase().trim();
        const users = getRegisteredUsers();
        
        // Find user by email or username (ignoring leading @ for username)
        const matchUser = [...DEFAULT_USERS, ...users].find(u => {
          const uEmail = u.email.toLowerCase();
          const uUsername = u.username.toLowerCase();
          const cleanIdentifier = identifier.startsWith("@") ? identifier.slice(1) : identifier;
          return uEmail === identifier || uUsername === cleanIdentifier;
        });

        if (!matchUser) {
          return { data: { session: null }, error: new Error("User does not exist. Please check your username/email or sign up first.") };
        }

        if (matchUser.password !== password) {
          return { data: { session: null }, error: new Error("Incorrect password. Please try again.") };
        }

        const session = {
          access_token: "mock-token",
          user: { 
            email: matchUser.email, 
            id: "mock-user-id",
            user_metadata: {
              full_name: matchUser.fullName,
              username: matchUser.username.startsWith("@") ? matchUser.username : `@${matchUser.username}`
            }
          },
          isMock: true
        };
        if (typeof window !== "undefined") {
          window.localStorage.setItem("mock-supabase-session", JSON.stringify(session));
        }
        triggerAuthChange("SIGNED_IN", session);
        return { data: { session }, error: null };
      },
      signUp: async ({ email, password, options }) => {
        const identifier = email.toLowerCase().trim();
        const users = getRegisteredUsers();
        
        // Check if user already exists
        const exists = [...DEFAULT_USERS, ...users].some(u => u.email.toLowerCase() === identifier);
        if (exists) {
          return { data: { user: null, session: null }, error: new Error("User already exists with this email.") };
        }

        const username = identifier.split("@")[0];
        const fullName = options?.data?.full_name || "New User";
        
        const newUser = {
          email: identifier,
          username,
          password,
          fullName
        };
        
        saveRegisteredUser(newUser);

        const session = {
          access_token: "mock-token",
          user: { 
            email: identifier, 
            id: "mock-user-id",
            user_metadata: {
              full_name: fullName,
              username: `@${username}`
            }
          },
          isMock: true
        };
        if (typeof window !== "undefined") {
          window.localStorage.setItem("mock-supabase-session", JSON.stringify(session));
        }
        triggerAuthChange("SIGNED_IN", session);
        return { data: { user: session.user, session }, error: null };
      },
      signOut: async () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("mock-supabase-session");
        }
        triggerAuthChange("SIGNED_OUT", null);
        return { error: null };
      },
      onAuthStateChange: (callback) => {
        listeners.push(callback);
        const session = getSessionFromStorage();
        // Delay callback slightly to mimic network event dispatch cycles and prevent state loops
        setTimeout(() => {
          callback(session ? "SIGNED_IN" : "SIGNED_OUT", session);
        }, 0);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                listeners = listeners.filter(cb => cb !== callback);
              }
            }
          }
        };
      }
    }
  };
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;
