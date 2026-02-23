import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Instagram, MessageCircle, Mail, Heart, MessageCircle as Comment, Share2, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from "sonner"
import Image from 'next/image'
import { set } from 'date-fns'
import { se } from 'date-fns/locale'
import { PiButterflyFill } from "react-icons/pi"

interface CreativePreviewPanelProps {
  campaignName: string
  instagramPost: string
  storyHeadline: string
  whatsappMessage: string
  emailSubject: string
  emailPreview: string
  destinations: string[]
}

export function CreativePreviewPanel({
  campaignName,
  instagramPost,
  storyHeadline,
  whatsappMessage,
  emailSubject,
  emailPreview,
}: CreativePreviewPanelProps) {
  const [whatsappResult, setWhatsappResult] = useState<any>(null)
  const [sending, setSending] = useState(false)
  const [blueskyResult, setBlueskyResult] = useState<any>(null)
  const [posting, setPosting] = useState(false)
  const [destInput, setDestInput] = useState("")
  const [callCustomers, setCallCustomers] = useState<any[]>([])
  const [selectedCallClients, setSelectedCallClients] = useState<string[]>([])
  const [loadingCallCustomers, setLoadingCallCustomers] = useState(false)
  const [calling, setCalling] = useState(false)
  const [callResult, setCallResult] = useState<any>(null)
  const handleSendWhatsApp = async () => {
    try {
      setSending(true)       // 🔥 show loader / disable button

      const stored = localStorage.getItem("selectedAgent")
      if (!stored) {
        toast.error("No agent selected.")
        setSending(false)
        return
      }

      const agent_id = stored

      // STEP 1 — fetch customers
      const res1 = await fetch(`http://localhost:5000/agents/${agent_id}/customers`)
      const customers = await res1.json()

      if (!customers || customers.length === 0) {
        toast.error("No customers found.")
        setSending(false)
        return
      }

      const customer_ids = customers.map(c => c.customer_id)

      // STEP 2 — send WhatsApp
      const res2 = await fetch("http://localhost:5001/api/execution/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id, customer_ids })
      })

      const result = await res2.json()
      console.log("WHATSAPP RESULT:", result)

      if (!result?.results?.length) {
        toast.error("WhatsApp sending failed.")
        setSending(false)
        return
      }

      // Store first one
      setWhatsappResult(result.results[0])

      toast.success(`WhatsApp sent to ${result.processed} client(s)`)

    } catch (err) {
      console.error(err)
      toast.error("Error sending WhatsApp messages.")
    }

    setSending(false)    // 🔥 stop loader
  }
  const handleBlueskyPost = async (destinations: string[]) => {
    try {
      setPosting(true)

      const res = await fetch("http://localhost:5001/api/execution/bluesky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinations })
      })

      const data = await res.json()

      if (!data.results || !data.results.length) {
        toast.error("Bluesky post generation failed.")
        setPosting(false)
        return
      }

      setBlueskyResult(data.results[0]) // show only first post
      toast.success(`Generated ${data.total} Bluesky posts`)
    } catch (err) {
      toast.error("Error posting to Bluesky.")
    }
    setPosting(false)
  }
  const fetchCallCustomers = async () => {
    try {
      setLoadingCallCustomers(true)

      const agent_id = localStorage.getItem("selectedAgent")
      if (!agent_id) {
        toast.error("No agent selected.")
        return
      }

      const res = await fetch(`http://localhost:5000/agents/${agent_id}/customers`)
      const data = await res.json()

      if (!Array.isArray(data)) {
        toast.error("Failed to fetch customers.")
        return
      }

      setCallCustomers(data)
    } catch {
      toast.error("Could not fetch customers.")
    }

    setLoadingCallCustomers(false)
  }

  // Toggle selection
  const toggleCallClient = (id: string) => {
    setSelectedCallClients(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Execute calling
  const handleCalling = async () => {
    try {
      if (selectedCallClients.length === 0) {
        toast.error("No clients selected.")
        return
      }

      setCalling(true)
      const agent_id = localStorage.getItem("selectedAgent")

      const res = await fetch("http://localhost:5001/api/execution/calling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id,
          customer_ids: selectedCallClients
        })
      })

      const data = await res.json()

      if (!data?.results?.length) {
        toast.error("Calling failed.")
        setCalling(false)
        return
      }

      setCallResult(data.results[0])
      toast.success(`Call triggered for ${data.processed} client(s)`)
    } catch {
      toast.error("Error making calls.")
    }

    setCalling(false)
  }
  useEffect(() => {
    fetchCallCustomers()
  }, [])
  return (
    <Card className="h-full p-6 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Creative Preview</h2>
          <p className="text-sm text-muted-foreground mt-1">See how your campaign appears across channels</p>
        </div>

        <Tabs defaultValue="bluesky" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger value="bluesky" className="flex items-center gap-2">
              <PiButterflyFill size={16} />
              <span className="hidden sm:inline">Bluesky</span>
            </TabsTrigger>


            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span className="hidden sm:inline">WhatsApp</span>
            </TabsTrigger>

            <TabsTrigger value="call" className="flex items-center gap-2">
              <Phone size={16} />
              <span className="hidden sm:inline">Call</span>
            </TabsTrigger>
          </TabsList>

          {/* Instagram Feed Preview */}
          <TabsContent value="bluesky" className="pt-6 space-y-4">

            {/* Destination Input */}
            <div className="max-w-md mx-auto space-y-2">
              <label className="text-sm font-medium">Enter Destinations (comma separated)</label>
              <input
                type="text"
                value={destInput}
                onChange={(e) => setDestInput(e.target.value)}
                placeholder="e.g. London, Bali, Dubai"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={() =>
                  handleBlueskyPost(
                    destInput.split(",").map(d => d.trim()).filter(Boolean)
                  )
                }
                disabled={posting}
                className={`bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold
                hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2
                ${posting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {posting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {posting ? "Generating..." : "Generate Bluesky Posts"}
              </button>
            </div>

            {/* Preview Box */}
            {blueskyResult && (
              <div className="border border-border rounded-lg overflow-hidden bg-black max-w-sm mx-auto">

                {/* Header */}
                <div className="bg-secondary border-b border-border px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-blue-400" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">travel_agent_pro</p>
                    <p className="text-xs text-muted-foreground">{blueskyResult.destination}</p>
                  </div>
                </div>

                {/* Image */}
                <div className="w-full aspect-square bg-black flex items-center justify-center">
                  <Image
                    src={blueskyResult.image_url}
                    alt="Post Image"
                    width={400}
                    height={0}           // required by TS, but ignored when style has height:auto
                    style={{ height: "auto" }}
                    className="object-cover w-full"
                  />
                </div>

                {/* Caption */}
                <div className="bg-secondary px-4 py-3 space-y-2">
                  <p className="text-sm text-foreground leading-relaxed">
                    {blueskyResult.caption}
                  </p>
                </div>

              </div>
            )}
          </TabsContent>

          {/* Story Preview */}


          {/* WhatsApp Preview */}
          {/* WhatsApp Preview */}
          <TabsContent value="whatsapp" className="pt-6 space-y-4">

            {/* WhatsApp UI Preview */}


            {/* SEND BUTTON */}
            <div className="flex justify-center">
              <button
                onClick={handleSendWhatsApp}
                disabled={sending}
                className={`bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold
                hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2
                ${sending ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {sending && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {sending ? "Sending..." : "Send WhatsApp to All Clients"}
              </button>
            </div>

            {/* DISPLAY BACKEND RESULT */}
            {whatsappResult && (
              <div className="border border-border rounded-lg bg-secondary p-4 max-w-md mx-auto space-y-4 shadow-sm">

                <h3 className="font-semibold text-lg">WhatsApp Delivery Preview</h3>

                {/* Image Bubble */}
                {whatsappResult.image_url && (
                  <div className="flex justify-end">
                    <div className="rounded-lg overflow-hidden max-w-[70%] shadow bg-[#dcf8c6]">
                      <Image
                        src={whatsappResult.image_url}
                        alt="Sent Media"
                        width={400}
                        height={250}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div className="flex justify-end">
                  <div className="bg-[#dcf8c6] text-black dark:text-white rounded-lg rounded-tr-none p-3 shadow max-w-[75%]">
                    <p className="text-sm leading-relaxed">{whatsappResult.message}</p>
                    <p className="text-[10px] text-black/60 mt-1 text-right">
                      Delivered ✓✓
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="text-xs text-muted-foreground space-y-1 pl-1">
                  <p><strong>Sent To:</strong> {whatsappResult.customer_name}</p>
                </div>
              </div>
            )}

          </TabsContent>

          {/* Email Preview */}
          <TabsContent value="call" className="pt-6 space-y-6">

            {/* LOADING TEXT */}
            {loadingCallCustomers && (
              <p className="text-center text-sm text-muted-foreground">
                Loading customers…
              </p>
            )}

            {/* CUSTOMER CHECKBOX LIST */}
            {!loadingCallCustomers && callCustomers.length > 0 && (
              <div className="space-y-3 max-w-md mx-auto">
                <h3 className="font-semibold text-lg text-center">
                  Select Clients to Call
                </h3>

                {callCustomers.map((c) => (
                  <label
                    key={c.customer_id}
                    className="flex items-center gap-3 p-3 border border-border rounded-md cursor-pointer hover:bg-secondary"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCallClients.includes(c.customer_id)}
                      onChange={() => toggleCallClient(c.customer_id)}
                      className="w-4 h-4"
                    />

                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* CALL BUTTON */}
            {!loadingCallCustomers && callCustomers.length > 0 && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleCalling}
                  disabled={calling}
                  className={`bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold
        hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2
        ${calling ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {calling && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {calling ? "Calling…" : "Call Selected Clients"}
                </button>
              </div>
            )}

            {/* RESULT PREVIEW */}
            {callResult && (
              <div className="border border-border rounded-lg bg-secondary p-4 max-w-md mx-auto space-y-3 shadow-sm">

                <h3 className="font-semibold text-lg">Call Triggered</h3>

                <div className="bg-black text-white p-3 rounded-md">
                  <p><strong>Customer:</strong> {callResult.customer_name}</p>
                  <p><strong>Destination:</strong> {callResult.destination}</p>
                  <p><strong>Status:</strong> {callResult.status}</p>

                  {callResult.error && (
                    <p className="text-red-400 text-sm mt-1">{callResult.error}</p>
                  )}
                </div>

              </div>
            )}

          </TabsContent>
        </Tabs>

        <Separator className="bg-border" />


      </div>
    </Card>
  )
}
