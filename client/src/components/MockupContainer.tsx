import React, { useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { IPhoneMockup } from "./IPhoneMockup";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface MockupContainerProps {
    children: React.ReactNode;
}

export function MockupContainer({ children }: MockupContainerProps) {
    const mockupRef = useRef<HTMLDivElement>(null);

    const handleCapture = useCallback(async () => {
        if (!mockupRef.current) return;

        try {
            const canvas = await html2canvas(mockupRef.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                logging: false,
            });

            const link = document.createElement("a");
            link.download = `smart-feed-screenshot-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Failed to capture screenshot:", error);
        }
    }, []);

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
            <IPhoneMockup ref={mockupRef}>{children}</IPhoneMockup>

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
