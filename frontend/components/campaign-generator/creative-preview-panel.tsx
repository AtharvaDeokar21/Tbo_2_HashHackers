import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MessageCircle, Mail, Phone, Loader, Check, X, Send, Zap, TrendingUp, AlertCircle, Users, BarChart3, Clock, Radio, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from "sonner"
import Image from 'next/image'
import { PiButterflyFill } from "react-icons/pi"

interface CreativePreviewPanelProps {
  campaignName: string
  instagramPost: string
  storyHeadline: string
  whatsappMessage: string
  emailSubject: string
  emailPreview: string
  destinations?: string[]
}

export function CreativePreviewPanel({
  campaignName,
  instagramPost,
  storyHeadline,
  whatsappMessage,
  emailSubject,
  emailPreview,
  destinations = [],
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
  const [executionMetrics, setExecutionMetrics] = useState({ bluesky: 0, whatsapp: 0, calls: 0 })

  const handleSendWhatsApp = async () => {
    try {
      setSending(true)

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
      setExecutionMetrics(prev => ({ ...prev, whatsapp: result.processed || 1 }))

      toast.success(`WhatsApp sent to ${result.processed} client(s)`)

    } catch (err) {
      console.error(err)
      toast.error("Error sending WhatsApp messages.")
    }

    setSending(false)
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

      setBlueskyResult(data.results[0])
      setExecutionMetrics(prev => ({ ...prev, bluesky: data.total || 1 }))
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

  const toggleCallClient = (id: string) => {
    setSelectedCallClients(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

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
      setExecutionMetrics(prev => ({ ...prev, calls: data.processed || 1 }))
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
    <div className="space-y-5">
      {/* Header with Metrics Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Radio className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Campaign Execution</h2>
              <p className="text-xs text-muted-foreground">Multi-channel deployment</p>
            </div>
          </div>
        </div>

        {/* Execution Metrics */}
        {(executionMetrics.bluesky > 0 || executionMetrics.whatsapp > 0 || executionMetrics.calls > 0) && (
          <div className="grid grid-cols-3 gap-2">
            {executionMetrics.bluesky > 0 && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
                <p className="text-xs text-muted-foreground font-semibold mb-1">BLUESKY POSTS</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{executionMetrics.bluesky}</p>
              </div>
            )}
            {executionMetrics.whatsapp > 0 && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40">
                <p className="text-xs text-muted-foreground font-semibold mb-1">WHATSAPP SENT</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{executionMetrics.whatsapp}</p>
              </div>
            )}
            {executionMetrics.calls > 0 && (
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40">
                <p className="text-xs text-muted-foreground font-semibold mb-1">CALLS TRIGGERED</p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{executionMetrics.calls}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Channel Tabs */}
      <Tabs defaultValue="bluesky" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/60 p-1.5 rounded-xl border border-border/40 h-11">
          <TabsTrigger value="bluesky" className="flex items-center gap-2 text-xs font-semibold h-8 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <PiButterflyFill size={15} />
            <span>Bluesky</span>
          </TabsTrigger>

          <TabsTrigger value="whatsapp" className="flex items-center gap-2 text-xs font-semibold h-8 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <MessageCircle size={15} />
            <span>WhatsApp</span>
          </TabsTrigger>

          <TabsTrigger value="call" className="flex items-center gap-2 text-xs font-semibold h-8 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Phone size={15} />
            <span>Voice Call</span>
          </TabsTrigger>
        </TabsList>

        {/* ====== BLUESKY TAB ====== */}
        <TabsContent value="bluesky" className="space-y-4 mt-5">
          {/* Setup Card */}
          <Card className="p-5 border border-blue-200/50 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/50 to-blue-50/30 dark:from-blue-950/20 dark:via-blue-950/15 dark:to-blue-950/10">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-2 block">
                  <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Target Destinations
                </label>
                <input
                  type="text"
                  value={destInput}
                  onChange={(e) => setDestInput(e.target.value)}
                  placeholder="Enter destinations (e.g., London, Bali, Dubai, Paris)..."
                  className="w-full px-4 py-2.5 border border-border/60 rounded-lg bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                />
                <p className="text-xs text-muted-foreground mt-2">Comma-separated list of destinations to generate posts for</p>
              </div>

              <button
                onClick={() =>
                  handleBlueskyPost(
                    destInput.split(",").map(d => d.trim()).filter(Boolean)
                  )
                }
                disabled={posting || !destInput.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md"
              >
                {posting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Generating Posts...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate & Publish</span>
                  </>
                )}
              </button>
            </div>
          </Card>

          {/* Result Card */}
          {blueskyResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Live Preview
                </h3>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold">✓ Published</Badge>
              </div>

              <Card className="overflow-hidden border-2 border-blue-200 dark:border-blue-800/60 shadow-sm hover:shadow-md transition-all bg-card">
                {/* Post Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-900/10 border-b border-blue-200 dark:border-blue-800/40 px-5 py-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    🦋
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground">travel_agent</p>
                    <p className="text-xs text-muted-foreground truncate">📍 {blueskyResult.destination}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">now</span>
                  </div>
                </div>

                {/* Image Section */}
                {blueskyResult.image_url && (
                  <div className="w-full bg-black aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                    <Image
                      src={blueskyResult.image_url}
                      alt="Post"
                      width={400}
                      height={300}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="p-5 space-y-4">
                  <p className="text-sm text-foreground leading-relaxed">{blueskyResult.caption}</p>

                  {/* Engagement Buttons */}
                  <div className="flex items-center gap-4 pt-3 border-t border-border/40">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-red-500 transition group">
                      <span className="text-base group-hover:scale-125 transition">❤️</span>
                      <span>Like</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-blue-500 transition group">
                      <span className="text-base group-hover:scale-125 transition">💬</span>
                      <span>Reply</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-green-500 transition group">
                      <span className="text-base group-hover:scale-125 transition">🔄</span>
                      <span>Repost</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-purple-500 transition group ml-auto">
                      <span className="text-base group-hover:scale-125 transition">📤</span>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ====== WHATSAPP TAB ====== */}
        <TabsContent value="whatsapp" className="space-y-4 mt-5">
          {/* Setup Card */}
          <Card className="p-5 border border-green-200/50 dark:border-green-800/40 bg-gradient-to-br from-green-50 via-green-50/50 to-green-50/30 dark:from-green-950/20 dark:via-green-950/15 dark:to-green-950/10">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Recipient Details
                </p>
                <div className="space-y-3 p-3 bg-background/50 rounded-lg border border-border/40">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-semibold">CHANNEL</span>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold">WhatsApp</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-semibold">RECIPIENTS</span>
                    <span className="text-sm font-bold text-foreground">All Active Customers</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Message will be sent to all customers in your database</p>
              </div>

              <button
                onClick={handleSendWhatsApp}
                disabled={sending}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md"
              >
                {sending ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Sending Messages...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Campaign</span>
                  </>
                )}
              </button>
            </div>
          </Card>

          {/* Result Card */}
          {whatsappResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  Delivery Confirmed
                </h3>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold">✓ Sent</Badge>
              </div>

              <Card className="overflow-hidden border-2 border-green-200 dark:border-green-800/60 shadow-sm bg-card">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-900/10 border-b border-green-200 dark:border-green-800/40 px-5 py-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                    W
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground">WhatsApp</p>
                    <p className="text-xs text-muted-foreground truncate">To: {whatsappResult.customer_name}</p>
                  </div>
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                {/* Message Preview */}
                <div className="p-5 bg-gradient-to-b from-muted/20 to-background space-y-4">
                  {whatsappResult.image_url && (
                    <div className="flex justify-end">
                      <div className="rounded-2xl overflow-hidden max-w-xs shadow-md border border-border/40 hover:shadow-lg transition-shadow">
                        <Image
                          src={whatsappResult.image_url}
                          alt="Media"
                          width={250}
                          height={180}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-900/20 text-foreground rounded-3xl rounded-tr-none px-5 py-3.5 max-w-xs shadow-sm border border-green-200/60 dark:border-green-800/40">
                      <p className="text-sm leading-relaxed">{whatsappResult.message}</p>
                      <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-green-200/40 dark:border-green-800/40">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-medium text-muted-foreground">now</span>
                        <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400 -ml-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ====== CALL TAB ====== */}
        <TabsContent value="call" className="space-y-4 mt-5">
          {/* Loading State */}
          {loadingCallCustomers && (
            <Card className="p-8 text-center border border-border/40 bg-muted/30">
              <Loader className="w-6 h-6 animate-spin mx-auto mb-3 text-primary" />
              <p className="text-sm font-semibold text-muted-foreground">Fetching customer list…</p>
            </Card>
          )}

          {/* Setup Card */}
          {!loadingCallCustomers && callCustomers.length > 0 && (
            <>
              <Card className="p-5 border border-border/60 bg-gradient-to-br from-background to-muted/5">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Select Customers to Call
                </h3>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                  {callCustomers.map((customer) => (
                    <label
                      key={customer.customer_id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/60 hover:border-primary/40 hover:bg-muted/60 cursor-pointer transition-all group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCallClients.includes(customer.customer_id)}
                        onChange={() => toggleCallClient(customer.customer_id)}
                        className="w-4 h-4 accent-primary cursor-pointer rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary text-xs font-medium ml-auto flex-shrink-0">Ready</Badge>
                    </label>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <span className="text-xs font-bold text-foreground">SELECTED</span>
                  <span className="text-lg font-bold text-primary">{selectedCallClients.length} / {callCustomers.length}</span>
                </div>

                <button
                  onClick={handleCalling}
                  disabled={calling || selectedCallClients.length === 0}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md disabled:shadow-none"
                >
                  {calling ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Initiating Calls...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4" />
                      <span>Call Selected Customers</span>
                      {selectedCallClients.length > 0 && <Badge className="ml-1 bg-white/20">{selectedCallClients.length}</Badge>}
                    </>
                  )}
                </button>
              </Card>
            </>
          )}

          {/* Result Card */}
          {callResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-600" />
                  Call In Progress
                </h3>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold animate-pulse">● Active</Badge>
              </div>

              <Card className="overflow-hidden border-2 border-orange-200 dark:border-orange-800/60 shadow-sm bg-card">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-50/50 dark:from-orange-950/20 dark:to-orange-900/10 border-b border-orange-200 dark:border-orange-800/40 px-5 py-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm animate-pulse">
                    ☎️
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground">Voice Call</p>
                    <p className="text-xs text-muted-foreground truncate">Customer: {callResult.customer_name}</p>
                  </div>
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                {/* Call Details */}
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Destination */}
                    <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Destination</p>
                      <p className="text-sm font-bold text-foreground">{callResult.destination}</p>
                    </div>

                    {/* Status */}
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Status</p>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200 font-bold">{callResult.status}</Badge>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {callResult.error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-1">Error</p>
                        <p className="text-xs text-red-600 dark:text-red-400">{callResult.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
