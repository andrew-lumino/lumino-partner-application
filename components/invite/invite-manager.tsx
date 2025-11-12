"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ScheduleAEditor from "./schedule-a-editor"
import CustomMessageEditor from "./custom-message-editor"
import CodeOfConductEditor from "./code-of-conduct-editor"
import { Copy, Loader2, Mail } from "lucide-react"

export default function InviteManager() {
  const [agent, setAgent] = useState("")
  const [email, setEmail] = useState("")
  const [emails, setEmails] = useState("")
  const [inviteLink, setInviteLink] = useState("")
  const [inviteId, setInviteId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isSendingMultiple, setIsSendingMultiple] = useState(false)

  const [scheduleType, setScheduleType] = useState<"default" | "custom">("default")
  const [customScheduleA, setCustomScheduleA] = useState<any>(null)

  const [useCustomMessage, setUseCustomMessage] = useState(false)
  const [customMessage, setCustomMessage] = useState<any>(null)

  const [useCustomConduct, setUseCustomConduct] = useState(false)
  const [customConduct, setCustomConduct] = useState<any>(null)

  const { toast } = useToast()

  const handleScheduleATypeChange = useCallback((type: "default" | "custom") => {
    setScheduleType(type)
  }, [])

  const handleScheduleADataChange = useCallback((data: any) => {
    setCustomScheduleA(data)
  }, [])

  const handleMessageChange = useCallback((data: any) => {
    setCustomMessage(data)
  }, [])

  const handleConductChange = useCallback((data: any) => {
    setCustomConduct(data)
  }, [])

  const sendInviteEmail = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      const payload = {
        email: email.trim(),
        agent: agent.trim() || "Unknown Agent",
        custom_schedule_a: scheduleType === "custom" && customScheduleA ? customScheduleA : null,
        custom_message: useCustomMessage && customMessage ? customMessage : null,
        custom_code_of_conduct: useCustomConduct && customConduct ? customConduct : null,
      }

      const sendRes = await fetch("/api/send-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const sendData = await sendRes.json()
      if (sendData.success) {
        const link = `https://partner.golumino.com?id=${sendData.inviteId}`
        setInviteLink(link)
        setInviteId(sendData.inviteId)

        toast({
          title: "Success!",
          description: `Invite email sent to ${email}`,
        })
      } else {
        throw new Error(sendData.error || "Failed to send email")
      }
    } catch (error) {
      console.error("Error sending invite:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invite email",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const sendMultipleInvites = async () => {
    const emailList = emails
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e && e.includes("@"))

    if (emailList.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one valid email address",
        variant: "destructive",
      })
      return
    }

    setIsSendingMultiple(true)
    try {
      const payload = {
        emails: emailList,
        agent: agent.trim() || "Unknown Agent",
        custom_schedule_a: scheduleType === "custom" && customScheduleA ? customScheduleA : null,
        custom_message: useCustomMessage && customMessage ? customMessage : null,
        custom_code_of_conduct: useCustomConduct && customConduct ? customConduct : null,
      }

      const res = await fetch("/api/send-multiple-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: data.message || `Sent ${emailList.length} invites successfully`,
        })
        setEmails("")
      } else {
        throw new Error(data.error || "Failed to send invites")
      }
    } catch (error) {
      console.error("Error sending invites:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invites",
        variant: "destructive",
      })
    } finally {
      setIsSendingMultiple(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Partner Invites</CardTitle>
        <CardDescription>Create personalized invitation links for potential partners</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Invite</TabsTrigger>
            <TabsTrigger value="multiple">Multiple Invites</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Agent Name *</label>
              <Input
                placeholder="Enter your name"
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                disabled={isLoading || isSending}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Partner Email *</label>
              <Input
                type="email"
                placeholder="partner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isSending}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <ScheduleAEditor
                scheduleType={scheduleType}
                customData={customScheduleA}
                onScheduleTypeChange={handleScheduleATypeChange}
                onCustomDataChange={handleScheduleADataChange}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Welcome Message</label>
                <Button
                  variant={useCustomMessage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseCustomMessage(!useCustomMessage)}
                  disabled={isLoading || isSending}
                >
                  {useCustomMessage ? "Using Custom" : "Use Default"}
                </Button>
              </div>
              {useCustomMessage && (
                <CustomMessageEditor
                  value={customMessage}
                  onChange={handleMessageChange}
                  disabled={isLoading || isSending}
                />
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Partner's Code of Conduct</label>
                <Button
                  variant={useCustomConduct ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseCustomConduct(!useCustomConduct)}
                  disabled={isLoading || isSending}
                >
                  {useCustomConduct ? "Using Custom" : "Use Default"}
                </Button>
              </div>
              {useCustomConduct && (
                <CodeOfConductEditor
                  value={customConduct}
                  onChange={handleConductChange}
                  disabled={isLoading || isSending}
                />
              )}
            </div>

            <Button onClick={sendInviteEmail} disabled={isLoading || isSending} className="w-full">
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email Invite
                </>
              )}
            </Button>

            {inviteLink && (
              <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                <label className="text-sm font-medium">Your Invite Link:</label>
                <div className="flex gap-2">
                  <Input value={inviteLink} readOnly className="font-mono text-sm" />
                  <Button onClick={copyToClipboard} size="icon" variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="multiple" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Agent Name *</label>
              <Input
                placeholder="Enter your name"
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                disabled={isSendingMultiple}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Addresses *</label>
              <textarea
                className="w-full min-h-[200px] p-3 border rounded-md font-mono text-sm"
                placeholder="partner1@example.com&#10;partner2@example.com&#10;partner3@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                disabled={isSendingMultiple}
              />
              <p className="text-xs text-muted-foreground">Enter one email address per line</p>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <ScheduleAEditor
                scheduleType={scheduleType}
                customData={customScheduleA}
                onScheduleTypeChange={handleScheduleATypeChange}
                onCustomDataChange={handleScheduleADataChange}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Welcome Message</label>
                <Button
                  variant={useCustomMessage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseCustomMessage(!useCustomMessage)}
                  disabled={isSendingMultiple}
                >
                  {useCustomMessage ? "Using Custom" : "Use Default"}
                </Button>
              </div>
              {useCustomMessage && (
                <CustomMessageEditor
                  value={customMessage}
                  onChange={handleMessageChange}
                  disabled={isSendingMultiple}
                />
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Partner's Code of Conduct</label>
                <Button
                  variant={useCustomConduct ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseCustomConduct(!useCustomConduct)}
                  disabled={isSendingMultiple}
                >
                  {useCustomConduct ? "Using Custom" : "Use Default"}
                </Button>
              </div>
              {useCustomConduct && (
                <CodeOfConductEditor
                  value={customConduct}
                  onChange={handleConductChange}
                  disabled={isSendingMultiple}
                />
              )}
            </div>

            <Button onClick={sendMultipleInvites} disabled={isSendingMultiple} className="w-full">
              {isSendingMultiple ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invites
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
