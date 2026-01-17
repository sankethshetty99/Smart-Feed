import React from "react";

interface IPhoneMockupProps {
    children: React.ReactNode;
}

export const IPhoneMockup = React.forwardRef<HTMLDivElement, IPhoneMockupProps>(
    ({ children }, ref) => {
        return (
            <div
                ref={ref}
                className="iphone-mockup"
                style={{
                    position: "relative",
                    width: "375px",
                    height: "812px",
                    backgroundColor: "#000",
                    borderRadius: "50px",
                    boxShadow:
                        "0 0 0 12px #1a1a1a, 0 0 0 14px #333, 0 25px 50px rgba(0,0,0,0.4)",
                    overflow: "hidden",
                }}
            >
                {/* Dynamic Island */}
                <div
                    style={{
                        position: "absolute",
                        top: "12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "126px",
                        height: "37px",
                        backgroundColor: "#000",
                        borderRadius: "20px",
                        zIndex: 20,
                    }}
                />

                {/* Screen content */}
                <div
                    className="iphone-screen"
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        right: "0",
                        bottom: "0",
                        borderRadius: "50px",
                        overflow: "hidden",
                        backgroundColor: "hsl(var(--background))",
                    }}
                >
                    {/* Safe area padding for Dynamic Island */}
                    <div
                        style={{
                            paddingTop: "59px",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {children}
                    </div>
                </div>

                {/* Home indicator */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "8px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "134px",
                        height: "5px",
                        backgroundColor: "hsl(var(--foreground))",
                        borderRadius: "3px",
                        opacity: 0.3,
                        zIndex: 20,
                    }}
                />
            </div>
        );
    }
);

IPhoneMockup.displayName = "IPhoneMockup";
