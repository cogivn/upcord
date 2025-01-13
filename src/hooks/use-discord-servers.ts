"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DiscordUserClient } from "@/lib/discord/user-client";

export interface DiscordServer {
  id: string;
  name: string;
  icon: string | null;
}

const CACHE_KEY = "discord_servers";
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

interface CachedData {
  servers: DiscordServer[];
  timestamp: number;
}

function getCachedServers(): CachedData | null {
  if (typeof window === "undefined") return null;
  
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const data: CachedData = JSON.parse(cached);
    const age = Date.now() - data.timestamp;
    
    // Return null if cache is expired
    if (age > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function setCachedServers(servers: DiscordServer[]) {
  if (typeof window === "undefined") return;
  
  const data: CachedData = {
    servers,
    timestamp: Date.now()
  };
  
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

export function useDiscordServers() {
  const { data: session, status } = useSession();
  const [servers, setServers] = useState<DiscordServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServers() {
      if (!session?.accessToken || !session?.userId) {
        setServers([]);
        setIsLoading(false);
        return;
      }

      try {
        // Check cache first
        const cached = getCachedServers();
        if (cached?.servers) {
          setServers(cached.servers);
          setIsLoading(false);
          return;
        }

        // Fetch fresh data if no cache
        const client = new DiscordUserClient(session.accessToken, session.userId);
        const guilds = await client.getUserGuilds();
        
        if (!Array.isArray(guilds)) {
          console.error("Invalid guilds response:", guilds);
          setServers([]);
          setError("Invalid server data received");
          return;
        }

        const serverData = guilds.map(guild => ({
          id: guild.id || "",
          name: guild.name || "Unknown Server",
          icon: guild.icon || null
        }));

        // Update state and cache
        setServers(serverData);
        setCachedServers(serverData);
      } catch (err) {
        console.error("Failed to fetch Discord servers", err);
        setError(err instanceof Error ? err.message : "Failed to fetch Discord servers");
        setServers([]);
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    if (status === "authenticated") {
      fetchServers();
    } else {
      setServers([]);
      setIsLoading(false);
    }
  }, [session, status]);

  return { servers, isLoading, error };
}
