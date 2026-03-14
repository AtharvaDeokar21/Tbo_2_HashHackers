'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { UserCircle, CheckCircle } from 'lucide-react'

export default function NewCustomerPage() {
    const params = useParams()
    const agentId = params.agentId as string

    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const [form, setForm] = useState({
        name: "",
        email: "",
        source_city: "",
        budget_range: "",
        risk_preference: "Medium",
    })

    const updateField = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)

            const payload = {
                agent_id: agentId,
                ...form
            }

            const res = await fetch("http://localhost:5000/customers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                alert("Failed to submit details")
                return
            }

            setSubmitted(true)

        } catch (err) {
            console.error("Submission failed", err)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <Card className="max-w-md w-full p-10 text-center space-y-4">
                    <CheckCircle className="mx-auto text-green-500" size={40} />
                    <h2 className="text-xl font-semibold">Details Submitted</h2>
                    <p className="text-sm text-muted-foreground">
                        Your travel preferences were sent to the agent.
                    </p>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
            <Card className="max-w-lg w-full p-8 space-y-6 border-border/50">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                        <UserCircle className="text-muted-foreground" size={26} />
                    </div>

                    <div>
                        <h1 className="text-xl font-semibold">Travel Profile</h1>
                        <p className="text-sm text-muted-foreground">
                            Submit your preferences to the travel agent
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <div className="space-y-5">

                    <div>
                        <Label>Name</Label>
                        <Input
                            placeholder="Your name"
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            placeholder="Email address"
                            value={form.email}
                            onChange={(e) => updateField("email", e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Source City</Label>
                        <Input
                            placeholder="City you will depart from"
                            value={form.source_city}
                            onChange={(e) => updateField("source_city", e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Budget Range</Label>
                        <Input
                            placeholder="Example: 1-2 Lakhs"
                            value={form.budget_range}
                            onChange={(e) => updateField("budget_range", e.target.value)}
                        />
                    </div>

                    

                </div>

                {/* Submit */}
                <Button
                    className="w-full"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? "Submitting..." : "Submit Details"}
                </Button>

            </Card>
        </div>
    )
}