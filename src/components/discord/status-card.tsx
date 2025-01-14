"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import { DiscordStatusDisplay } from "./status-display"
import { DiscordLogo } from "./discord-logo"

export function DiscordConnectionCard() {
  const { data: session, status } = useSession()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-[#5865F2] to-[#4752C4] p-6">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4">
              <DiscordLogo className="h-10 w-10 text-white" />
              <h2 className="text-2xl font-bold text-white">Discord Connection</h2>
            </div>
            {session && (
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="text-sm font-medium text-white">Connected</span>
              </div>
            )}
          </motion.div>
        </div>
        <div className="p-6">
          {status === "loading" ? (
            <div className="flex items-center justify-center h-32">
              <motion.div
                className="h-8 w-8 border-4 border-[#5865F2] border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : session ? (
            <DiscordStatusDisplay />
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center space-y-6 py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-center text-gray-600 dark:text-gray-400">
                Connect your Discord account to get started
              </p>
              <Button
                onClick={() => signIn("discord")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <DiscordLogo className="h-5 w-5 mr-2" />
                <span>Connect Discord Account</span>
                <motion.div
                  className="absolute inset-0 bg-white rounded-md"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: isHovered ? 1.1 : 0, opacity: isHovered ? 0.1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

