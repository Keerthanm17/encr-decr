"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy, Lock, Unlock, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EncryptionPage() {
  const [plainText, setPlainText] = useState("")
  const [encryptedText, setEncryptedText] = useState("")
  const [decryptText, setDecryptText] = useState("")
  const [decryptedText, setDecryptedText] = useState("")
  const [password, setPassword] = useState("")
  const [decryptPassword, setDecryptPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showDecryptPassword, setShowDecryptPassword] = useState(false)
  const { toast } = useToast()

  // Convert string to ArrayBuffer
  const stringToArrayBuffer = (str: string): ArrayBuffer => {
    const encoder = new TextEncoder()
    return encoder.encode(str)
  }

  // Convert ArrayBuffer to string
  const arrayBufferToString = (buffer: ArrayBuffer): string => {
    const decoder = new TextDecoder()
    return decoder.decode(buffer)
  }

  // Generate key from password
  const generateKey = async (password: string): Promise<CryptoKey> => {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
      "deriveBits",
      "deriveKey",
    ])

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("salt"), // In production, use random salt
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    )
  }

  // Encrypt function
  const encryptMessage = async () => {
    if (!plainText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to encrypt",
        variant: "destructive",
      })
      return
    }

    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive",
      })
      return
    }

    try {
      const key = await generateKey(password)
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const encodedText = stringToArrayBuffer(plainText)

      const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encodedText)

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encrypted), iv.length)

      // Convert to base64
      const base64 = btoa(String.fromCharCode(...combined))
      setEncryptedText(base64)

      toast({
        title: "Success",
        description: "Text encrypted successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to encrypt text",
        variant: "destructive",
      })
    }
  }

  // Decrypt function
  const decryptMessage = async () => {
    if (!decryptText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to decrypt",
        variant: "destructive",
      })
      return
    }

    if (!decryptPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter the password",
        variant: "destructive",
      })
      return
    }

    try {
      const key = await generateKey(decryptPassword)

      // Convert from base64
      const combined = new Uint8Array(
        atob(decryptText)
          .split("")
          .map((char) => char.charCodeAt(0)),
      )

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12)
      const encrypted = combined.slice(12)

      const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, encrypted)

      const decryptedMessage = arrayBufferToString(decrypted)
      setDecryptedText(decryptedMessage)

      toast({
        title: "Success",
        description: "Text decrypted successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decrypt text. Check your password and encrypted text.",
        variant: "destructive",
      })
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Secure Text Encryption</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Encrypt and decrypt your messages with AES-256 encryption
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Encryption Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Encrypt Message
              </CardTitle>
              <CardDescription>Enter your text and password to encrypt your message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="plaintext">Message to Encrypt</Label>
                <Textarea
                  id="plaintext"
                  placeholder="Enter your message here..."
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  className="min-h-[120px] mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter encryption password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button onClick={encryptMessage} className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Encrypt Message
              </Button>

              {encryptedText && (
                <div>
                  <Label>Encrypted Message</Label>
                  <div className="relative mt-2">
                    <Textarea value={encryptedText} readOnly className="min-h-[120px] bg-gray-50 dark:bg-gray-800" />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-transparent"
                      onClick={() => copyToClipboard(encryptedText)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Decryption Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5 text-blue-600" />
                Decrypt Message
              </CardTitle>
              <CardDescription>Enter encrypted text and password to decrypt your message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="encryptedInput">Encrypted Message</Label>
                <Textarea
                  id="encryptedInput"
                  placeholder="Paste encrypted message here..."
                  value={decryptText}
                  onChange={(e) => setDecryptText(e.target.value)}
                  className="min-h-[120px] mt-2"
                />
              </div>

              <div>
                <Label htmlFor="decryptPassword">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="decryptPassword"
                    type={showDecryptPassword ? "text" : "password"}
                    placeholder="Enter decryption password"
                    value={decryptPassword}
                    onChange={(e) => setDecryptPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowDecryptPassword(!showDecryptPassword)}
                  >
                    {showDecryptPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button onClick={decryptMessage} className="w-full">
                <Unlock className="h-4 w-4 mr-2" />
                Decrypt Message
              </Button>

              {decryptedText && (
                <div>
                  <Label>Decrypted Message</Label>
                  <div className="relative mt-2">
                    <Textarea value={decryptedText} readOnly className="min-h-[120px] bg-gray-50 dark:bg-gray-800" />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-transparent"
                      onClick={() => copyToClipboard(decryptedText)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 dark:text-yellow-400 mt-1">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Security Notice</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  This encryption runs entirely in your browser. Your passwords and messages are never sent to any
                  server. Remember your password - it cannot be recovered if lost.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
