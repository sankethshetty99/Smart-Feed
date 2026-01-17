import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button } from "@/components/ui/button";

interface MobileMockupProps {
    children: React.ReactNode;
}

export function MobileMockup({ children }: MobileMockupProps) {
    const mockupRef = useRef<HTMLDivElement>(null);

    const handleScreenshot = async () => {
        if (mockupRef.current) {
            const canvas = await html2canvas(mockupRef.current, {
                useCORS: true,
                scale: 2, // Retain high quality
                backgroundColor: null,
            });

            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = "mockup-screenshot.png";
            link.click();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-dot-pattern p-8 gap-12 font-sans text-gray-900 bg-gray-50">
            {/* Mockup Frame */}
            <div className="relative shrink-0">
                {/* Outer Frame */}
                <div
                    ref={mockupRef}
                    className="relative w-[375px] h-[812px] bg-background rounded-[40px] shadow-2xl border-[12px] border-gray-900 overflow-hidden ring-1 ring-black/5 transform-gpu"
                >
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[34px] bg-gray-900 rounded-b-[24px] z-50 pointer-events-none flex items-center justify-center">
                        {/* Speaker/Camera indicators inside notch can be added here if desired, keeping it simple for now */}
                    </div>

                    {/* Status Bar Mock (optional, for realism) */}
                    <div className="absolute top-0 w-full h-[40px] z-40 flex justify-between px-6 pt-3 text-[12px] font-medium text-foreground pointer-events-none">
                        <span>9:41</span>
                        <div className="flex gap-1">
                            {/* Icons would go here */}
                        </div>
                    </div>

                    {/* Screen Content */}
                    <div className="w-full h-full bg-background overflow-y-auto no-scrollbar pt-[40px] pb-[20px]">
                        {children}
                    </div>
                </div>
                {/* Side buttons mock */}
                <div className="absolute top-[100px] -left-[14px] w-[3px] h-[26px] bg-gray-800 rounded-l-md"></div>
                <div className="absolute top-[140px] -left-[14px] w-[3px] h-[46px] bg-gray-800 rounded-l-md"></div>
                <div className="absolute top-[196px] -left-[14px] w-[3px] h-[46px] bg-gray-800 rounded-l-md"></div>
                <div className="absolute top-[140px] -right-[14px] w-[3px] h-[64px] bg-gray-800 rounded-r-md"></div>
            </div>

            {/* Action Panel */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border shadow-sm max-w-xs text-center">
                <Button onClick={handleScreenshot} className="mb-4">
                    Capture Screenshot
                </Button>
                <p className="text-sm text-muted-foreground">
                    Click the button to capture a screenshot of the iPhone mockup in its current state.
                </p>
            </div>
        </div>
    );
}
