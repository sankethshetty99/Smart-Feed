import React, { useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { IPhoneMockup } from "./IPhoneMockup";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "lucide-react";

interface MockupContainerProps {
    children: React.ReactNode;
}

export function MockupContainer({ children }: MockupContainerProps) {
    // Ref is now attached to a wrapper div to capture the shadow/bezel
    const mockupWrapperRef = useRef<HTMLDivElement>(null);

    const { toast } = useToast();

    const handleCapture = useCallback(async () => {
        console.log("Starting screenshot capture...");
        if (!mockupWrapperRef.current) {
            console.error("Mockup wrapper ref is null");
            toast({
                variant: "destructive",
                title: "Screenshot failed",
                description: "Could not find the mockup element to capture.",
            });
            return;
        }

        try {
            console.log("Creating canvas...");
            const canvas = await html2canvas(mockupWrapperRef.current, {
                backgroundColor: null, // Set to null for transparency
                scale: 2,
                useCORS: true,
                logging: true,
                allowTaint: true,
            });

            console.log("Canvas created, converting to data URL...");
            // Verify canvas has content
            if (canvas.width === 0 || canvas.height === 0) {
                throw new Error("Canvas has 0 dimensions");
            }

            const dataUrl = canvas.toDataURL("image/png");
            console.log("Data URL created, triggering download...");

            const link = document.createElement("a");
            link.download = `smart-feed-screenshot-${Date.now()}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log("Download triggered successfully");
            toast({
                title: "Screenshot captured",
                description: "The screenshot has been downloaded to your device.",
            });
        } catch (error) {
            console.error("Failed to capture screenshot:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast({
                variant: "destructive",
                title: "Screenshot failed",
                description: `Error: ${errorMessage}. Check console for details.`,
            });
        }
    }, [toast]);

    return (
        <div
            className="mockup-container"
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "48px",
                padding: "32px",
                background:
                    "linear-gradient(135deg, hsl(220 15% 15%) 0%, hsl(220 20% 8%) 100%)",
            }}
        >
            {/* 
                Wrapper div to capture the full mockup including constructed bezel.
                Background is transparent (default) to allow transparency in screenshot.
            */}
            <div
                ref={mockupWrapperRef}
                style={{
                    display: "inline-block",
                    padding: "20px", // Padding for external drop shadow
                }}
            >
                {/* 
                    Structural Bezel Construction
                    Replaces the CSS box-shadow which is unreliable in html2canvas.
                    Simplified to a single sleek frame.
                */}
                <div
                    style={{
                        backgroundColor: "#111", // Dark Slate/Black phone body
                        borderRadius: "60px", // Smooth curve matching phone
                        padding: "12px", // Standard bezel thickness
                        boxShadow: "0 20px 40px rgba(0,0,0,0.4)", // External drop shadow
                        border: "4px solid #333", // Subtle outer rim for definition
                        display: "inline-block",
                    }}
                >
                    {/* 
                        Phone Content 
                        Remove the default box-shadow from the mockup since we built it manually 
                    */}
                    <IPhoneMockup style={{ boxShadow: "none", borderRadius: "48px" }}>{children}</IPhoneMockup>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <Button
                    onClick={handleCapture}
                    size="lg"
                    className="gap-2 px-6 py-6 text-base font-medium shadow-lg"
                    style={{
                        background: "linear-gradient(135deg, #00c853 0%, #00a844 100%)",
                        border: "none",
                    }}
                >
                    <Camera className="w-5 h-5" />
                    Capture Screenshot
                </Button>

            </div>
        </div>
    );
}
