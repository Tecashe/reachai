
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Lock } from "lucide-react"
import Link from "next/link"

interface UpgradePromptProps {
    title?: string
    description?: string
    featureName?: string
}

export function UpgradePrompt({
    title = "Upgrade to Pro",
    description = "Unlock the full power of AI automation.",
    featureName = "This AI feature"
}: UpgradePromptProps) {
    return (
        <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3 text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{featureName} is available on paid plans.</CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-2">
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
            <CardFooter className="justify-center pt-2">
                <Button asChild size="sm" className="gap-2">
                    <Link href="/dashboard/billing">
                        <Lock className="h-3.5 w-3.5" />
                        Upgrade Plan
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
